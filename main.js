const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Cria a janela do navegador.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      // Anexa o script de pré-carregamento.
      preload: path.join(__dirname, 'preload.js'),
      // É uma boa prática de segurança manter essas opções.
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Carrega o arquivo survivors.html no aplicativo.
  mainWindow.loadFile('survivors.html');

  // Opcional: Maximiza a janela ao iniciar.
  mainWindow.maximize();

  // Opcional: Remove o menu superior (Arquivo, Editar, etc.).
  mainWindow.setMenu(null);
}

// Este método será chamado quando o Electron terminar a inicialização
// e estiver pronto para criar as janelas do navegador.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // No macOS, é comum recriar uma janela no aplicativo quando o
    // ícone do dock é clicado e não há outras janelas abertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Encerra o aplicativo quando todas as janelas são fechadas, exceto no macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});