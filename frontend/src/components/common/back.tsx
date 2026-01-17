'use client'

import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Back = () => {
  const navigate = useNavigate()
  return <ArrowLeft className='size-5! cursor-pointer' onClick={() => navigate(-1)} />
}

export default Back
