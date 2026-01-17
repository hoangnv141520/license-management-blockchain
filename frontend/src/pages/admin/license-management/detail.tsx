import LicenseDetailView from '@/components/role/admin/license-management/license-detail-view'
import { useParams } from 'react-router-dom'

const LicenseDetailPage = () => {
  const { slug } = useParams()

  if (!slug) return null

  return <LicenseDetailView id={slug} />
}

export default LicenseDetailPage
