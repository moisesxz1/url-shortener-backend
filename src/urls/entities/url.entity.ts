import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn() // Auto-incrementing ID
  id: number;

  @Column({ unique: true })
  originalUrl: string;

  @Column({ unique: true, nullable: true })
  shortUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  accessCount: number;

  @Column({ type: 'text', nullable: true })
  title: string;
}
