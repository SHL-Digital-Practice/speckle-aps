import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApsJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  speckleStream: string;

  @Column()
  apsUri: string;
}
