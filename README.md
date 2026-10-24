# NA Fitness

Site demonstrativo da academia NA Fitness, com planos, agenda semanal, treinos e formulário de interesse.

## Executar localmente

```powershell
python -m pip install -r requirements.txt
python main.py
```

Abra `http://127.0.0.1:5000` no navegador.

## GitHub Pages

O Pages publica o frontend estático (`index.html`, `style.css` e `script.js`); ele não executa `main.py` nem o Flask. Depois de enviar os arquivos ao GitHub, configure Pages para publicar a partir da branch `main`, diretório raiz (`/`). Os caminhos relativos dos recursos permitem publicar também em um repositório de projeto.

Planos, preços, horários, instrutores e endereço ainda são demonstrativos. Reservas e formulário não estão conectados a um backend.