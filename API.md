Método: POST
Endpoint: /api/upload
Tipo de dados: multipart/form-data (arquivo)
Campo esperado: file (que deve conter o XML)

curl -X POST -F "file=@./files/teste1.xml" http://localhost:3000/api/upload
