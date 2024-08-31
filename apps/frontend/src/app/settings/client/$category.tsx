import { createFileRoute } from '@tanstack/react-router'

import DynamicOptions from '../-components/DynamicOptions'

const Category = () => {
  const { category } = Route.useParams()

  return <DynamicOptions device="local" group={category} />
}

export const Route = createFileRoute( '/settings/client/$category' )( {
  component: Category,
} )
