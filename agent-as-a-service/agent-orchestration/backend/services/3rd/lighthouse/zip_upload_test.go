package lighthouse

import (
	"reflect"
	"testing"
)

func TestZipAndUploadFileInMultiplePartsToLightHouseByUrl(t *testing.T) {
	type args struct {
		filename string
		fileDir  string
	}
	tests := []struct {
		name    string
		args    args
		want    []string
		wantErr bool
	}{
		{
			name: "Test Case 1",
			args: args{filename: "test1", fileDir: ""},
		},
	}
	for _, tt := range tests {
		t.Run(
			tt.name,
			func(t *testing.T) {
				got, err := ZipAndUploadFileInMultiplePartsToLightHouseByUrl(
					"url",
					"/tmp/data",
					"lighthouse-key")
				if (err != nil) != tt.wantErr {
					t.Errorf("getListZipFile() error = %v, wantErr %v", err, tt.wantErr)
					return
				}
				if !reflect.DeepEqual(got, tt.want) {
					t.Errorf("getListZipFile() = %v, want %v", got, tt.want)
				}
			},
		)
	}
}

func TestDownloadHFModelFromLightHouse(t *testing.T) {
	type args struct {
		hash  string
		hfDir string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Test Case 1",
			args: args{hash: "filecoin-hash", hfDir: "/tmp/download"},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := DownloadFileFromLightHouse(tt.args.hash, tt.args.hfDir); (err != nil) != tt.wantErr {
				t.Errorf("DownloadHFModelFromLightHouse() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
