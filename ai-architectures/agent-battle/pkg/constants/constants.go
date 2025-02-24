package constants

import "time"

const (
	FiberRequestTimeoutInSec         = 30
	FiberRequestDownloadTimeoutInSec = 300
)

const (
	ErrBadRequest         = 400_000
	ErrNotFound           = 404_000
	ErrPreconditionFailed = 412_000
	ErrInternal           = 500_000
)

//
const (
	// DefaultEthereumTokenGasLimit is the default gas limit for Ethereum token transfers
	// Typically, the gas limit for Ethereum token transfers around 45,000 - 100,000
	DefaultEthereumTokenGasLimit = 100000

	// DefaultEthereumGasLimit is the default gas limit for Ethereum transfers
	DefaultEthereumGasLimit = 30000

	// MarkCompletedGameBufferTime is the buffer time to mark the game as completed, it is from the result updated time
	MarkCompletedGameBufferTime = 15 * time.Minute
)