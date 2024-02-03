import { Injectable, Logger } from '@nestjs/common';
import {
  ModelDerivativeClient,
  AuthenticationClient,
} from 'forge-server-utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApsService {
  constructor(private configService: ConfigService) {}

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

  async startJob(urn: string): string {
    Logger.log('Test Starting Job', 'URN:', urn);
    //get lastest version

    //get the derivative with the urn

    //if not get the job done
    // this.modelDerivativeClient.getDerivative(urn, );

    const res = await this.modelDerivativeClient.submitJob(urn, [
      {
        type: 'ifc',
      },
    ]);

    return 'Job started';
  }

  async getIfc(urn: string) {
    const manifest = await this.modelDerivativeClient.getManifest(urn);

    let ifcDerivativeUrn = '';

    manifest.derivatives.forEach((derivative) => {
      if (derivative.outputType === 'ifc') {
        // Logger.log('Derivative:', derivative.children[0].urn);

        ifcDerivativeUrn = derivative.children[0].urn;
      }
    });

    const { access_token } = await this.authenticationClient.authenticate([
      'data:read',
      'data:write',
    ]);

    // const derivativethis.modelDerivativeClient.getDerivative(urn, 'ifc');
    const url = await this.getSignedUrlFromDerivative(
      urn,
      ifcDerivativeUrn,
      access_token,
    );

    return url;
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
