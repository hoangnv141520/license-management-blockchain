import DossierDetailView from '@/components/role/admin/dossier-management/dossier-detail-view'
import { useParams } from 'react-router-dom'

const DossierDetailPage = () => {
  const { slug } = useParams()

  if (!slug) return null

  return <DossierDetailView id={slug} />
}

export default DossierDetailPage
