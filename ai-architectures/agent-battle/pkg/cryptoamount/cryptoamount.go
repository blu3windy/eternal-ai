package cryptoamount

import (
	"fmt"
	"math"
	"math/big"
	"strconv"
)

const (
	defaultStringDecimals = 6
	defaultRoundOn        = 0.5
)

var (
	// bigNumberRoundingFactor is the factor for rounding the big number.
	// For example, 1e5 is used for rounding the big number to 5 decimal places.
	// This will be used for rounding down the last digit.
	bigNumberRoundingFactor = big.NewInt(1e5)
)

// CryptoAmount is a type for representing a cryptocurrency amount.
// It represents the uint256 value in the smart contract.
// For example, 1 USDC is represented as 1 * 10^6 = 1000000. So the CryptoAmount is 1000000.
type CryptoAmount float64

func (a CryptoAmount) ToBigInt() *big.Int {
	if a == 0 {
		return nil
	}

	// Convert float64 to big.Float first to avoid precision loss
	bigFloat := new(big.Float).SetFloat64(a.ToFloat64())

	// Convert big.Float to big.Int (truncating decimal part)
	bigInt := new(big.Int)
	bigFloat.Int(bigInt) // This rounds down automatically

	return bigInt
}

// ToString converts the CryptoAmount to a string with the given number of decimals.
// For example, if the CryptoAmount is 100000 and the decimals is 6 and defaultStringDecimals is 6,
// the result is "0.100000".
func (a CryptoAmount) ToString(decimals int) string {
	if decimals == 0 {
		return "0"
	}

	// round the CryptoAmount to the value like int with places is 0
	rounded := round(a.ToFloat64(), defaultRoundOn, 0)
	floatValueWithDecimals := rounded / math.Pow10(decimals)

	// round again with the defaultStringDecimals
	floatValueWithDecimals = round(floatValueWithDecimals, defaultRoundOn, defaultStringDecimals)
	cryptAmountStr := fmt.Sprintf("%."+strconv.Itoa(defaultStringDecimals)+"f", floatValueWithDecimals)
	return cryptAmountStr
}

func (a CryptoAmount) ToFloat64() float64 {
	return float64(a)
}

func (a CryptoAmount) Round(places int) CryptoAmount {
	return CryptoAmount(round(a.ToFloat64(), defaultRoundOn, places))
}

// round rounds the floatValue to the given number of places.
func round(floatValue float64, roundOn float64, places int) float64 {
	var round float64
	pow := math.Pow(10, float64(places))
	digit := pow * floatValue
	_, div := math.Modf(digit)
	if div >= roundOn {
		round = math.Ceil(digit)
	} else {
		round = math.Floor(digit)
	}
	return round / pow
}

// NewCryptoAmountFromBigInt creates a new CryptoAmount from the given big.Int.
// The big.Int is rounded to the nearest number with the bigNumberRoundingFactor.
// For example, if the big.Int is 1000001 and the bigNumberRoundingFactor is 1e5, the result is 1000000.
func NewCryptoAmountFromBigInt(a *big.Int) CryptoAmount {
	if a == nil {
		return 0
	}

	// Calculate the remainder: remainder = num % bigNumberRoundingFactor
	remainder := new(big.Int)
	remainder.Mod(a, bigNumberRoundingFactor)

	// Calculate the rounded number: rounded = num - remainder
	rounded := new(big.Int)
	rounded.Sub(a, remainder)

	// Convert the rounded number to float64
	floatValue, _ := new(big.Float).SetInt(rounded).Float64()

	return CryptoAmount(floatValue).Round(0)
}
