import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, Default } from 'sequelize-typescript';
import { HoSo } from './HoSo';

@Table({
  tableName: 'giay_phep',
  timestamps: true,
  underscored: true,
})
export class GiayPhep extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => HoSo)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  ho_so_id!: string;

  @BelongsTo(() => HoSo)
  ho_so!: HoSo;

  @Column({ type: DataType.STRING(100), allowNull: false })
  loai_giay_phep!: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  so_giay_phep!: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  ngay_hieu_luc!: Date;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  ngay_het_han!: Date;

  @Column({ type: DataType.STRING(100), allowNull: false })
  trang_thai_giay_phep!: string;

  @Column(DataType.TEXT)
  file_duong_dan?: string;

  @Column(DataType.TEXT)
  h1_hash?: string;

  @Column(DataType.TEXT)
  h2_hash?: string;

  @Default('ChuaDongBo')
  @Column(DataType.STRING(100))
  trang_thai_blockchain?: string;
}
