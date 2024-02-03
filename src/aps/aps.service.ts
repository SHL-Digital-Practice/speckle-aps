import { Injectable, Logger } from '@nestjs/common';
import {
  ModelDerivativeClient,
  AuthenticationClient,
} from 'forge-server-utils';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { ApsJob } from './entities/aps-job.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApsService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(ApsJob)
    private apsjobRepository: Repository<ApsJob>,
  ) {}

  modelDerivativeClient: ModelDerivativeClient;
  authenticationClient: AuthenticationClient;
  auth: { client_id: string; client_secret: string; scope?: string[] };

  onModuleInit() {
    Logger.log('Test Initializing Model Derivative client');
    Logger.log(this.configService.getOrThrow<string>('APS_CLIENT_ID'));
    this.auth = {
      client_id: this.configService.getOrThrow<string>('APS_CLIENT_ID'),
      client_secret: this.configService.getOrThrow<string>('APS_CLIENT_SECRET'),
    };

    this.authenticationClient = new AuthenticationClient(
      this.auth.client_id,
      this.auth.client_secret,
    );
    this.modelDerivativeClient = new ModelDerivativeClient(this.auth);
  }

  async startApsJob(urn: string) {
    try {
      const existingJob = await this.apsjobRepository.find({
        where: { apsUri: urn },
      });

      if (existingJob.length > 0) {
        return 'Job already started';
      }

      this.apsjobRepository.save({ apsUri: urn });

      const res = await this.modelDerivativeClient.submitJob(urn, [
        {
          type: 'ifc',
        },
      ]);

      return res;
    } catch (error) {
      Logger.error(error);
    }
  }

  async getIfcDerivativeUrn(modelUrn: string) {
    const manifest = await this.modelDerivativeClient.getManifest(modelUrn);

    let ifcDerivativeUrn;
    manifest.derivatives.forEach((derivative) => {
      if (derivative.outputType === 'ifc' && derivative.status === 'success') {
        ifcDerivativeUrn = derivative.children[0].urn;
      }
    });

    return ifcDerivativeUrn;
  }

  async ifcToSpeckle(modelUrn: string, ifcDerivativeUrn: string) {
    const { access_token } = await this.authenticationClient.authenticate([
      'data:read',
      'data:write',
    ]);

    // const derivativethis.modelDerivativeClient.getDerivative(urn, 'ifc');
    const url = await this.getSignedUrlFromDerivative(
      modelUrn,
      ifcDerivativeUrn,
      access_token,
    );

    return this.uplaodIfcToSpeckle(modelUrn, url);
  }

  async uplaodIfcToSpeckle(modelUrn: string, ifcDownloadUrl: string) {
    //upload to speckle
    const response = await firstValueFrom(
      this.httpService.get(
        'https://b26c-193-5-54-12.ngrok-free.app/ifc_to_speckle',
        {
          params: { url: ifcDownloadUrl },
        },
      ),
    );

    type SpeckleObject = {
      object_id: string;
      commit_url: string;
    };

    this.apsjobRepository.update(
      { apsUri: modelUrn },
      { speckleStream: response.data.object_id },
    );

    const speckleObject: SpeckleObject = {
      object_id: response.data.object_id,
      commit_url: response.data.commit_url,
    };
    return speckleObject;
  }

  async getSignedUrlFromDerivative(
    urn: string,
    derivative: string,
    token: string,
  ) {
    try {
      const url = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn.replaceAll(
        '=',
        '',
      )}/manifest/${derivative}/signedcookies?useCdn=true`;

      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };

      const res = await fetch(url, options);
      const resJSON = await res.json();
      if (!resJSON.url) throw new Error('No signed url');

      const cookieHeader = res.headers.get('set-cookie');
      if (!cookieHeader) throw new Error('No cookie header');

      const cookies = cookieHeader.split(', ');

      const policy = cookies[0].split('=')[1].split(';')[0];
      const keypair = cookies[1].split('=')[1].split(';')[0];
      const signature = cookies[2].split('=')[1].split(';')[0];

      const data = {
        name: derivative.split('/').slice(-1)[0],
        url: resJSON.url,
        'CloudFront-Policy': policy,
        'CloudFront-Key-Pair-Id': keypair,
        'CloudFront-Signature': signature,
      };

      const downloadUrl = `${data.url}?Policy=${data['CloudFront-Policy']}&Key-Pair-Id=${data['CloudFront-Key-Pair-Id']}&Signature=${data['CloudFront-Signature']}`;

      return downloadUrl;
    } catch (error) {
      throw error;
    }
  }
}