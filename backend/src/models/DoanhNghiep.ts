import { Table, Column, Model, DataType, HasMany, PrimaryKey, Default } from 'sequelize-typescript';
import { HoSo } from './HoSo';

@Table({
  tableName: 'doanh_nghiep',
  timestamps: true,
  underscored: true,
})
export class DoanhNghiep extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  ten_doanh_nghiep_vi!: string;

  @Column(DataType.TEXT)
  ten_doanh_nghiep_en?: string;

  @Column(DataType.TEXT)
  ten_viet_tat?: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  dia_chi!: string;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  ma_so_doanh_nghiep!: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  ngay_cap_msdn_lan_dau!: Date;

  @Column({ type: DataType.TEXT, allowNull: false })
  noi_cap_msdn!: string;

  @Column(DataType.INTEGER)
  so_lan_thay_doi_msdn?: number;

  @Column(DataType.DATEONLY)
  ngay_thay_doi_msdn?: Date;

  @Column(DataType.STRING(20))
  sdt?: string;

  @Column(DataType.STRING(255))
  email?: string;

  @Column(DataType.STRING(255))
  website?: string;

  @Column(DataType.STRING(100))
  von_dieu_le?: string;

  @Column(DataType.TEXT)
  nguoi_dai_dien?: string;

  @Column(DataType.TEXT)
  chuc_vu?: string;

  @Column(DataType.STRING(50))
  loai_dinh_danh?: string;

  @Column(DataType.DATEONLY)
  ngay_cap_dinh_danh?: Date;

  @Column(DataType.TEXT)
  noi_cap_dinh_danh?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  status!: boolean;

  @Column(DataType.TEXT)
  file_gcndkdn?: string;

  @HasMany(() => HoSo)
  ho_sos!: HoSo[];
}
