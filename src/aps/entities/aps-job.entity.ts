import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApsJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  speckleStreamUrl: string;

  @Column({ nullable: true })
  speckleRootObjectId: string;

  @Column()
  apsUri: string;

  @Column({ nullable: true })
  apsProjectName: string;
}
