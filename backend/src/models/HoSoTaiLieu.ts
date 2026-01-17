import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, PrimaryKey, Default } from 'sequelize-typescript';
import { HoSo } from './HoSo';
import { LoaiTaiLieu } from './LoaiTaiLieu';
import { TaiLieu } from './TaiLieu';

@Table({
  tableName: 'ho_so_tai_lieu',
  timestamps: false,
  underscored: true,
})
export class HoSoTaiLieu extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => HoSo)
  @Column({ type: DataType.UUID, allowNull: false })
  ho_so_id!: string;

  @BelongsTo(() => HoSo)
  ho_so!: HoSo;

  @ForeignKey(() => LoaiTaiLieu)
  @Column({ type: DataType.UUID, allowNull: false })
  loai_tai_lieu_id!: string;

  @BelongsTo(() => LoaiTaiLieu)
  loai_tai_lieu!: LoaiTaiLieu;

  @HasMany(() => TaiLieu)
  tai_lieus!: TaiLieu[];
}
