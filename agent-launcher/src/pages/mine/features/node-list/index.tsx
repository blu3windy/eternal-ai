import { Flex } from '@chakra-ui/react'
import NodeCard from '../../components/node-card'
import { useNodes } from '../../stores/useNodes'

const NodeList = () => {
  const nodes = useNodes(state => state.items);

  return (
    <Flex flexDirection="row" gap={'24px'}>
      {nodes.map((node) => (
        <NodeCard key={node.id} {...node} />
      ))}
    </Flex>
  )
}

export default NodeList
