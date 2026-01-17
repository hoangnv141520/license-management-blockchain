import BusinessDetailView from '@/components/role/admin/business-management/business-detail-view'
import { useParams } from 'react-router-dom'

const BusinessDetailPage = () => {
  const { slug } = useParams()

  if (!slug) return null

  return <BusinessDetailView id={slug} />
}

export default BusinessDetailPage
