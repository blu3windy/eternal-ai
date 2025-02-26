import type { EarningsNode } from '../../../types/data';

export const MOCK_NODES: EarningsNode[] = [
  {
    id: "1",
    name: "node-1242",
    image: "/images/mocks/mac.png",
    earnings: 124.42,
    status: "EARNED",
    network: {
      id: "1",
      name: "network-1",
      image: "/images/mocks/arb.png",
      health_status: "HEALTHY",
      progress_status: "RUNNING",
    },
    model: {
      id: "1",
      name: "model-1",
      image: "/images/mocks/llama.png",
      memory: 2.32,
    },
    onchain_data: {
      address: "0x1234567890123456789012345678901234567890",
      id: "1",
      processing_tasks: 10,
    },
    device: {
      id: "1",
      name: "device-1",
      os: "LINUX",
      processor: "Intel Core i7",
      ram: 16,
      gpu: "NVIDIA GeForce RTX 3070",
      gpu_cores: 8,
    },
  },
  {
    id: "2",
    name: "node-1242",
    image: "/images/mocks/mac.png",
    earnings: 124.42,
    status: "EARNED",
    network: {
      id: "1",
      name: "network-1",
      image: "/images/mocks/arb.png",
      health_status: "HEALTHY",
      progress_status: "RUNNING",
    },
    model: {
      id: "1",
      name: "model-1",
      image: "/images/mocks/llama.png",
      memory: 2.32,
    },
    onchain_data: {
      address: "0x1234567890123456789012345678901234567890",
      id: "1",
      processing_tasks: 10,
    },
    device: {
      id: "1",
      name: "device-1",
      os: "LINUX",
      processor: "Intel Core i7",
      ram: 16,
      gpu: "NVIDIA GeForce RTX 3070",
      gpu_cores: 8,
    },
  },
]
