import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({
  tableName: 'loai_tai_lieu',
  timestamps: false, // No createdAt/updatedAt in Go struct
  underscored: true,
})
export class LoaiTaiLieu extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  ten!: string;

  @Column(DataType.TEXT)
  mo_ta?: string;
}
