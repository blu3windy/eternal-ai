package ethapi

// func (c *Client) DeployAgentUpgradeable(prkHex string) (string, string, error) {
// 	_, prk, err := c.parsePrkAuth(prkHex)
// 	if err != nil {
// 		return "", "", err
// 	}
// 	chainID, err := c.GetChainID()
// 	if err != nil {
// 		return "", "", err
// 	}
// 	auth, err := bind.NewKeyedTransactorWithChainID(prk, big.NewInt(int64(chainID)))
// 	if err != nil {
// 		return "", "", err
// 	}
// 	client, err := c.getClient()
// 	if err != nil {
// 		return "", "", err
// 	}
// 	gasPrice, err := c.getGasPrice()
// 	if err != nil {
// 		return "", "", err
// 	}
// 	auth.GasPrice = gasPrice
// 	address, tx, _, err := agentupgradeable.DeployAgentUpgradeable(auth, client)
// 	if err != nil {
// 		return "", "", err
// 	}
// 	return address.Hex(), tx.Hash().Hex(), nil
// }
