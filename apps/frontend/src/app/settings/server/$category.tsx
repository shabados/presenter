import { createFileRoute } from '@tanstack/react-router'

import DynamicOptions from '../-components/DynamicOptions'

const Category = () => {
  const { category } = Route.useParams()

  return <DynamicOptions device="server" group={category} />
}

export const Route = createFileRoute( '/settings/server/$category' )( {
  component: Category,
} )
