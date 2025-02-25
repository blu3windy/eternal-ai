package cryptoamount

import (
	"math/big"
	"reflect"
	"testing"
)

func TestCryptoAmount_ToString(t *testing.T) {
	type args struct {
		decimals int
	}
	tests := []struct {
		name string
		a    CryptoAmount
		args args
		want string
	}{
		{
			name: "Test with 6 decimals and 0.100000",
			a:    100000,
			args: args{decimals: 6},
			want: "0.100000",
		},
		{
			name: "Test with 18 decimals and 0.123456",
			a:    123456000000000000,
			args: args{decimals: 18},
			want: "0.123456",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.a.ToString(tt.args.decimals); got != tt.want {
				t.Errorf("ToString() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestNewCryptoAmountFromBigInt(t *testing.T) {
	type args struct {
		a *big.Int
	}
	tests := []struct {
		name string
		args args
		want CryptoAmount
	}{
		{
			name: "Test with 6000702858264400936 - round down 5 last digits",
			args: args{a: newBigIntWithString("6000702858264400936")},
			want: 6000702858264400000,
		},
		{
			name: "Test with 1000000000000000000 = 1e18 = 1 EAI",
			args: args{a: newBigIntWithString("1000000000000000000")},
			want: 1000000000000000000,
		},
		{
			name: "Test with 100000000000000000 = 1e17 = 0.1 EAI",
			args: args{a: newBigIntWithString("100000000000000000")},
			want: 100000000000000000,
		},
		{
			name: "Test with 10000000000000000000 = 1e19 = 10 EAI",
			args: args{a: newBigIntWithString("10000000000000000000")},
			want: 10000000000000000000,
		},
		{
			name: "Test with 100000000000000000000 = 1e20 = 100 EAI",
			args: args{a: newBigIntWithString("100000000000000000000")},
			want: 100000000000000000000,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := NewCryptoAmountFromBigInt(tt.args.a); got != tt.want {
				t.Errorf("NewCryptoAmountFromBigInt() = %v, want %v", got, tt.want)
			}
		})
	}
}

func newBigIntWithString(value string) *big.Int {
	bigInt := new(big.Int)
	bigInt.SetString(value, 10)
	return bigInt
}

func TestCryptoAmount_ToBigInt(t *testing.T) {
	tests := []struct {
		name string
		a    CryptoAmount
		want *big.Int
	}{
		{
			name: "Test with 100000000000000000000 = 1e20 = 100 EAI",
			a: NewCryptoAmountFromBigInt(newBigIntWithString("100000000000000000000")),
			want: newBigIntWithString("100000000000000000000"),
		},
		{
			name: "Test with 10000000000000000000 = 1e19 = 10 EAI",
			a: NewCryptoAmountFromBigInt(newBigIntWithString("10000000000000000000")),
			want: newBigIntWithString("10000000000000000000"),
		},
		{
			name: "Test with 1000000000000000000 = 1e18 = 1 EAI",
			a: NewCryptoAmountFromBigInt(newBigIntWithString("1000000000000000000")),
			want: newBigIntWithString("1000000000000000000"),
		},
		{
			name: "Test with 100000000000000000 = 1e17 = 0.1 EAI",
			a: NewCryptoAmountFromBigInt(newBigIntWithString("100000000000000000")),
			want: newBigIntWithString("100000000000000000"),
		},
		{
			name: "Test with 6000702858264400936 - round down 5 last digits",
			a: NewCryptoAmountFromBigInt(newBigIntWithString("6000702858264400936")),
			want: newBigIntWithString("6000702858264399872"), // accept rounding down
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.a.ToBigInt(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ToBigInt() = %v, want %v", got, tt.want)
			}
		})
	}
}