import sequelize from './config/database';
import { LoaiTaiLieu } from './models/LoaiTaiLieu';

const loaiTaiLieuData = [
    { ten: 'Đơn đề nghị cấp Giấy phép kinh doanh', mo_ta: 'Mẫu đơn đề nghị cấp Giấy phép kinh doanh sản phẩm, dịch vụ mật mã dân sự' },
    { ten: 'Giấy chứng nhận đăng ký doanh nghiệp', mo_ta: 'Bản sao công chứng Giấy chứng nhận ĐKKD' },
    { ten: 'Danh sách đội ngũ kĩ thuật và văn bằng', mo_ta: 'Danh sách nhân sự kỹ thuật kèm văn bằng chứng chỉ' },
    { ten: 'Phương án kinh doanh', mo_ta: 'Phương án kinh doanh chi tiết' },
    { ten: 'Phương án bảo mật và an toàn thông tin mạng', mo_ta: 'Phương án đảm bảo an toàn thông tin' },
    { ten: 'Phương án kỹ thuật và Phương án bảo hành bảo trì', mo_ta: 'Phương án kỹ thuật, bảo hành bảo trì sản phẩm' },
    { ten: 'Tài liệu kĩ thuật', mo_ta: 'Tài liệu kỹ thuật của sản phẩm' },
    { ten: 'Giấy chứng nhận hợp quy', mo_ta: 'Giấy chứng nhận hợp quy sản phẩm mật mã' },
    { ten: 'Đơn đề nghị cấp sửa đổi, bổ sung Giấy phép kinh doanh', mo_ta: 'Mẫu đơn đề nghị sửa đổi, bổ sung Giấy phép' },
    { ten: 'Giấy phép kinh doanh sản phẩm, dịch vụ mật mã dân sự', mo_ta: 'Bản sao Giấy phép kinh doanh đã được cấp' },
    { ten: 'Đơn đề nghị gia hạn Giấy phép kinh doanh', mo_ta: 'Mẫu đơn đề nghị gia hạn Giấy phép' },
    { ten: 'Báo cáo hoạt động của doanh nghiệp', mo_ta: 'Báo cáo hoạt động kinh doanh của doanh nghiệp' },
    { ten: 'Đơn đề nghị cấp lại Giấy phép kinh doanh', mo_ta: 'Mẫu đơn đề nghị cấp lại Giấy phép' },
    { ten: 'Đơn đề nghị cấp Giấy phép xuất khẩu, nhập khẩu', mo_ta: 'Mẫu đơn đề nghị cấp Giấy phép XNK' }
];

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Sync models (without force to avoid data loss)
        await sequelize.sync();
        console.log('✅ Models synced');

        // Seed LoaiTaiLieu
        for (const item of loaiTaiLieuData) {
            const [record, created] = await LoaiTaiLieu.findOrCreate({
                where: { ten: item.ten },
                defaults: item
            });
            if (created) {
                console.log(`✅ Created: ${item.ten}`);
            } else {
                console.log(`⏭️  Already exists: ${item.ten}`);
            }
        }

        console.log('\n🎉 Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
