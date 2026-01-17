import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne, HasMany, PrimaryKey, Default } from 'sequelize-typescript';
import { DoanhNghiep } from './DoanhNghiep';
import { GiayPhep } from './GiayPhep';
import { HoSoTaiLieu } from './HoSoTaiLieu';

@Table({
  tableName: 'ho_so',
  timestamps: true,
  underscored: true,
})
export class HoSo extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => DoanhNghiep)
  @Column({ type: DataType.UUID, allowNull: false })
  doanh_nghiep_id!: string;

  @BelongsTo(() => DoanhNghiep)
  doanh_nghiep!: DoanhNghiep;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  ma_ho_so!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  loai_thu_tuc!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  ngay_dang_ky!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  ngay_tiep_nhan!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  ngay_hen_tra!: Date;

  @Column(DataType.STRING(100))
  so_giay_phep_theo_ho_so?: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  trang_thai_ho_so!: string;

  @HasOne(() => GiayPhep)
  giay_phep?: GiayPhep;

  @HasMany(() => HoSoTaiLieu)
  ho_so_tai_lieus!: HoSoTaiLieu[];
}
