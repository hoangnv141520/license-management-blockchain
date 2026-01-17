import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, Default, CreatedAt } from 'sequelize-typescript';
import { HoSoTaiLieu } from './HoSoTaiLieu';

@Table({
  tableName: 'tai_lieu',
  timestamps: true,
  updatedAt: false, // Go struct only has CreatedAt
  underscored: true,
})
export class TaiLieu extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => HoSoTaiLieu)
  @Column({ type: DataType.UUID, allowNull: false })
  ho_so_tai_lieu_id!: string;

  @BelongsTo(() => HoSoTaiLieu)
  ho_so_tai_lieu!: HoSoTaiLieu;

  @Column(DataType.TEXT)
  tieu_de?: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  duong_dan!: string;
  
  @CreatedAt
  created_at!: Date;
}
