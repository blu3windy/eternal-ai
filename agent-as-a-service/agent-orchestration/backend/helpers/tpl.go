package helpers

import (
	"bytes"
	"encoding/base64"
	"html/template"
)

var funcMap = template.FuncMap{
	"unescape": func(s string) template.HTML {
		return template.HTML(s)
	},
}

func GenerateTemplateContent(templateContent string, data interface{}) (string, error) {
	tmpl, err := template.New("content").Funcs(funcMap).Parse(templateContent)
	if err != nil {
		return "", err
	}
	var tpl bytes.Buffer
	err = tmpl.ExecuteTemplate(&tpl, "content", data)
	if err != nil {
		return "", err
	}
	return tpl.String(), nil
}

func Base64Encode(data []byte) string {
	sDec := base64.StdEncoding.EncodeToString(data)
	return sDec
}
