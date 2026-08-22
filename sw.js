<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RED TECAMAC - Análisis de Afectaciones</title>

    <!-- Configuración PWA / Móvil -->
    <link rel="manifest" href="./manifest.json">
    <meta name="theme-color" content="#00d4ff">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="RedTecamac">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">

    <style>
        * { box-sizing: border-box; }
        body { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); min-height: 100vh; color: #e8e8e8; font-family: 'Segoe UI', sans-serif; padding: 0; margin: 0; }
        .app-header { background: linear-gradient(135deg, #00d4ff 0%, #0077b6 50%, #004a99 100%); color: white; padding: 20px 15px; text-align: center; box-shadow: 0 4px 30px rgba(0, 212, 255, 0.3); position: relative; overflow: hidden; }
        .app-header h1 { font-size: 1.6rem; font-weight: 700; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); position: relative; z-index: 1; margin: 0; }
        .app-header p { opacity: 0.9; font-size: 0.9rem; margin-top: 5px; position: relative; z-index: 1; margin-bottom: 0; }
        .main-container { max-width: 1400px; margin: 0 auto; padding: 15px 10px; }
        .nav-tabs-custom { display: flex; gap: 10px; margin-bottom: 20px; justify-content: center; }
        .tab-btn { background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); color: #ccc; padding: 10px 20px; border-radius: 50px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: all 0.3s ease; backdrop-filter: blur(10px); }
        .tab-btn:hover { background: rgba(0, 212, 255, 0.2); border-color: #00d4ff; color: white; }
        .tab-btn.active { background: linear-gradient(135deg, #00d4ff, #0077b6); border-color: #00d4ff; color: white; box-shadow: 0 5px 25px rgba(0, 212, 255, 0.4); }
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fadeIn 0.3s ease; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .search-wrapper { max-width: 700px; margin: 0 auto 20px auto; }
        #mainSearch { background: rgba(255, 255, 255, 0.95); border: none; border-radius: 50px !important; padding: 15px 25px !important; width: 100% !important; font-size: 1rem; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); outline: none; color: #333; transition: all 0.3s ease; }
        #mainSearch:focus { box-shadow: 0 10px 50px rgba(0, 212, 255, 0.5); }
        
        .analysis-panel { background: rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .paste-area { background: rgba(0, 0, 0, 0.3); border: 2px dashed rgba(0, 212, 255, 0.5); border-radius: 15px; padding: 15px; min-height: 150px; color: #ccc; font-family: 'Consolas', 'Monaco', monospace; font-size: 0.85rem; resize: vertical; width: 100%; outline: none; transition: all 0.3s ease; }
        .btn-analyze { background: linear-gradient(135deg, #00d4ff, #0077b6); border: none; color: white; padding: 12px 35px; border-radius: 50px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: 15px; box-shadow: 0 5px 25px rgba(0, 212, 255, 0.4); }
        .btn-clear { background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); color: #ccc; padding: 12px 25px; border-radius: 50px; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; margin-top: 15px; margin-left: 10px; }
        
        .results-panel { margin-top: 25px; display: none; }
        .results-panel.visible { display: block; }
        .stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px; }
        .stat-card { background: rgba(255, 255, 255, 0.08); border-radius: 15px; padding: 15px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.1); }
        .stat-card .number { font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, #00d4ff, #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        #contenedorTabla, #contenedorResultados { background: rgba(255, 255, 255, 0.95); border-radius: 20px; padding: 15px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); color: #333; overflow-x: auto; }
        .table { color: #333 !important; }
        .table thead th { background: linear-gradient(135deg, #004a99, #0077b6) !important; color: white !important; font-size: 0.75rem; padding: 12px 10px !important; }

        .fila-cancelada { background-color: #ffcccc !important; color: #990000 !important; font-weight: 500; }
        .fila-inactiva { background-color: #e2e8f0 !important; color: #475569 !important; }
        .not-found { background: rgba(255, 82, 82, 0.1) !important; color: #ff5252 !important; }

        .qr-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 0.8rem; }
        .qr-hot { background: linear-gradient(135deg, #ff416c, #ff4b2b); color: white; }
        .qr-warm { background: linear-gradient(135deg, #f7971e, #ffd200); color: #333; }
        .qr-normal { background: rgba(0, 119, 182, 0.15); color: #0077b6; }
        .footer-info { text-align: center; padding: 15px; color: #aaa; font-size: 0.85rem; }

        /* Estilos del Login en Pantalla Completa integrados al tema */
        .login-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            display: flex; justify-content: center; align-items: center; z-index: 9999;
        }
        .login-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 20px;
            padding: 30px;
            width: 90%;
            max-width: 400px;
            backdrop-filter: blur(10px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            text-align: center;
        }
        .login-input {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(0, 212, 255, 0.3);
            color: #fff;
            border-radius: 25px;
            padding: 10px 20px;
            margin-bottom: 15px;
            width: 100%;
            outline: none;
        }
        .login-input:focus {
            border-color: #00d4ff;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
        .user-info-bar {
            position: absolute; right: 15px; top: 15px; display: flex; align-items: center; gap: 10px; z-index: 10;
        }
        .user-badge {
            background: rgba(255, 255, 255, 0.2); padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
        }
        .btn-logout {
            background: rgba(255, 82, 82, 0.8); border: none; color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; cursor: pointer;
        }

        /* --- SOLUCIÓN SCROLL ENCABEZADO MÓVIL --- */
        .dataTables_scroll {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
        }
        .dataTables_scrollHead,
        .dataTables_scrollBody {
            overflow: visible !important;
        }
    </style>
</head>

<body>

    <!-- OVERLAY LOGIN -->
    <div id="loginOverlay" class="login-overlay">
        <div class="login-card">
            <h3 style="color: #00d4ff; font-weight: 700; margin-bottom: 5px;">🔐 SISTEMA CORE</h3>
            <p style="color: #aaa; font-size: 0.85rem; margin-bottom: 20px;">Inicio de Sesión Tecamac</p>
            <form onsubmit="event.preventDefault(); procesarLogin();">
                <input type="text" id="userInput" class="login-input" placeholder="Usuario" required autocomplete="username">
                <input type="password" id="passInput" class="login-input" placeholder="Contraseña" required autocomplete="current-password">
                <div id="loginError" style="color: #ff5252; font-size: 0.85rem; margin-bottom: 10px; display: none;">
                    ⚠️ Usuario o contraseña incorrectos
                </div>
                <button type="submit" class="btn-analyze" style="width: 100%; margin-top: 5px;">Ingresar</button>
            </form>
        </div>
    </div>

    <!-- ENCABEZADO -->
    <div class="app-header">
        <div id="userInfoBar" class="user-info-bar" style="display: none;">
            <span class="user-badge" id="lblUsuario">Usuario</span>
            <button class="btn-logout" onclick="cerrarSesion()">Salir</button>
        </div>
        <h1>🛰️ SISTEMA CORE TECAMAC</h1>
        <p>Análisis de Red y Afectaciones Masivas</p>
    </div>

    <div class="main-container">

        <div class="nav-tabs-custom">
            <button class="tab-btn active" data-tab="busqueda">🔍 Búsqueda Individual</button>
            <button class="tab-btn" data-tab="analisis">📊 Análisis Masivo</button>
        </div>

        <div id="tab-busqueda" class="tab-content active">
            <div class="search-wrapper">
                <input type="text" id="mainSearch" placeholder="🔍 Buscar por Cuenta, QR u OLT..." autocomplete="off">
            </div>
            <div id="mensajeVacio" class="text-center mt-4">
                <p style="font-size: 2.5rem; margin-bottom: 5px;">📡</p>
                <p id="loadingStatus">Cargando base de datos...</p>
            </div>
            <div id="contenedorTabla" style="display: none;">
                <table id="tablaMaestra" class="table table-hover w-100">
                    <thead>
                        <tr>
                            <th>Cuenta</th> <th>QR</th> <th>OLT</th> <th>FSP</th> <th>Lat</th> <th>Lon</th> <th>Ubicación</th> <th>Puerto N2</th> <th>Estatus</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>

        <div id="tab-analisis" class="tab-content">
            <div class="analysis-panel">
                <h4 style="color: #00d4ff; margin-bottom: 15px;">📋 Pegar datos del OLT</h4>
                <textarea id="pasteArea" class="paste-area" placeholder="Pega aquí los datos del OLT..."></textarea>
                <div class="text-center">
                    <button class="btn-analyze" onclick="analizarDatos()">🔎 Analizar Afectación</button>
                    <button class="btn-clear" onclick="limpiarAnalisis()">🗑️ Limpiar</button>
                </div>
            </div>

            <div id="resultadosAnalisis" class="results-panel">
                <div class="stats-cards">
                    <div class="stat-card">
                        <div class="number" id="statTotal">0</div>
                        <div class="label">Clientes Analizados</div>
                    </div>
                    <div class="stat-card">
                        <div class="number" id="statEncontrados">0</div>
                        <div class="label">Encontrados</div>
                    </div>
                    <div class="stat-card">
                        <div class="number" id="statNoEncontrados">0</div>
                        <div class="label">No Encontrados</div>
                    </div>
                    <div class="stat-card">
                        <div class="number" id="statQRs">0</div>
                        <div class="label">QRs Afectados</div>
                    </div>
                </div>

                <div id="contenedorResultados">
                    <table id="tablaResultados" class="table table-hover w-100">
                        <thead>
                            <tr>
                                <th>Cuenta</th> <th>QR</th> <th>OLT</th> <th>FSP</th> <th>Lat</th> <th>Lon</th> <th>Estatus</th> <th>Clientes en QR</th>
                            </tr>
                        </thead>
                        <tbody id="bodyResultados"></tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>

    <div class="footer-info">
        Sistema Core Tecamac | Datos cargados: <span id="totalRegistros">0</span> registros
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"></script>

    <script>
        // LISTADO DE USUARIOS AUTORIZADOS
        const USUARIOS = {
            "antonio": "Tecamac2026*",
            "mildred": "MA123",
            "supervisor": "Tecamac2026*",
            "francisco": "Tecamac2026*"
        };

        function procesarLogin() {
            var u = $('#userInput').val().trim().toLowerCase();
            var p = $('#passInput').val();

            if (USUARIOS[u] && USUARIOS[u] === p) {
                sessionStorage.setItem("acceso_permitido", "true");
                sessionStorage.setItem("usuario_nombre", u.toUpperCase());
                iniciarSistema();
            } else {
                $('#loginError').show();
            }
        }

        function iniciarSistema() {
            $('#loginOverlay').fadeOut(300);
            $('#userInfoBar').show();
            $('#lblUsuario').text('👤 ' + sessionStorage.getItem("usuario_nombre"));
            cargarBaseDatos();
        }

        function cerrarSesion() {
            sessionStorage.clear();
            location.reload();
        }

        $.fn.dataTable.ext.errMode = 'none';

        var table;
        var tableResultados;
        var datosCSV = [];
        var datosIndexados = {};

        $(document).ready(function () {
            // Comprobación de sesión activa
            if (sessionStorage.getItem("acceso_permitido") === "true") {
                iniciarSistema();
            }

            $('.tab-btn').on('click', function () {
                var tabId = $(this).data('tab');
                $('.tab-btn').removeClass('active');
                $(this).addClass('active');
                $('.tab-content').removeClass('active');
                $('#tab-' + tabId).addClass('active');
            });
        });

        function cargarBaseDatos() {
            if (datosCSV.length > 0) return; // Evita doble carga si ya leyó el CSV

            setTimeout(function() {
                Papa.parse("datos.csv", {
                    download: true,
                    header: false,
                    skipEmptyLines: true,
                    complete: function (results) {
                        datosCSV = results.data.slice(1);
                        $('#totalRegistros').text(datosCSV.length.toLocaleString());
                        $('#loadingStatus').text('Ingresa un término de búsqueda...');

                        datosCSV.forEach(function (row) {
                            if (row[0]) {
                                var cuentaLimpia = row[0].replace(/[^0-9]/g, '').trim();
                                datosIndexados[cuentaLimpia] = row;
                            }
                        });

                        table = $('#tablaMaestra').DataTable({
                            data: datosCSV,
                            deferRender: true,
                            scrollY: "60vh",
                            scrollCollapse: true,
                            dom: 'rtip',
                            pageLength: 18,
                            language: { "info": "Mostrando _TOTAL_ registros", "paginate": { "next": "Sig", "previous": "Ant" } },
                            columnDefs: [{ targets: 8, defaultContent: "ACTIVA" }],
                            createdRow: function(row, data, dataIndex) {
                                var estatus = (data[8] || "").toUpperCase().trim();
                                if (estatus === "CANCELADA") $(row).addClass('fila-cancelada');
                                else if (estatus === "INACTIVA") $(row).addClass('fila-inactiva');
                            }
                        });

                        $('#mainSearch').on('keyup input', function () {
                            var val = $(this).val().trim();
                            if (val.length < 1) {
                                $('#contenedorTabla').hide();
                                $('#mensajeVacio').show();
                                table.search('').draw();
                            } else {
                                $('#contenedorTabla').show();
                                $('#mensajeVacio').hide();
                                table.search(val).draw();
                            }
                        });
                    }
                });
            }, 100);
        }

        function extraerCuentas(texto) {
            var cuentas = [];
            var lineas = texto.split('\n');
            lineas.forEach(function (linea) {
                linea = linea.trim();
                if (!linea) return;
                var matchDesc = linea.match(/(\d{10})_TP_/i);
                if (matchDesc) {
                    cuentas.push(matchDesc[1]);
                } else {
                    var matchNumeros = linea.match(/\b(0\d{9})\b/g);
                    if (matchNumeros) { matchNumeros.forEach(n => cuentas.push(n)); }
                }
            });
            return [...new Set(cuentas)];
        }

        function analizarDatos() {
            var texto = $('#pasteArea').val();
            if (!texto.trim()) return alert('Pega los datos primero.');

            if (tableResultados) { tableResultados.destroy(); }

            var cuentas = extraerCuentas(texto);
            var conteoQR = {};
            var encontrados = 0;
            var noEncontrados = 0;
            var html = '';

            cuentas.forEach(c => {
                var d = datosIndexados[c];
                if(d) {
                    var qr = d[1] || 'N/A';
                    conteoQR[qr] = (conteoQR[qr] || 0) + 1;
                }
            });

            cuentas.forEach(function (cuenta) {
                var d = datosIndexados[cuenta];
                if (d) {
                    encontrados++;
                    var est = (d[8] || "ACTIVA").toUpperCase().trim();
                    var qrCount = conteoQR[d[1]] || 0;
                    var badgeClass = qrCount >= 5 ? 'qr-hot' : (qrCount >= 3 ? 'qr-warm' : 'qr-normal');
                    var rowCl = (est === "CANCELADA") ? "fila-cancelada" : (est === "INACTIVA" ? "fila-inactiva" : "");

                    html += `<tr class="${rowCl}">
                        <td><strong>${cuenta}</strong></td>
                        <td><span class="qr-badge ${badgeClass}">${d[1]}</span></td>
                        <td>${d[2]}</td>
                        <td>${d[3]}</td>
                        <td>${d[4] || ''}</td>
                        <td>${d[5] || ''}</td>
                        <td>${est}</td>
                        <td>${qrCount}</td>
                    </tr>`;
                } else {
                    noEncontrados++;
                    html += `<tr class="not-found"><td>${cuenta}</td><td colspan="7">NO ENCONTRADO EN BASE</td></tr>`;
                }
            });

            $('#bodyResultados').html(html);
            
            tableResultados = $('#tablaResultados').DataTable({
                dom: 'rtip',
                pageLength: 25,
                language: { "info": "Mostrando _TOTAL_ resultados" }
            });

            $('#statTotal').text(cuentas.length);
            $('#statEncontrados').text(encontrados);
            $('#statNoEncontrados').text(noEncontrados);
            $('#statQRs').text(Object.keys(conteoQR).length);
            $('#resultadosAnalisis').addClass('visible');
        }

        function limpiarAnalisis() {
            if (tableResultados) { tableResultados.destroy(); tableResultados = null; }
            $('#bodyResultados').empty();
            $('#pasteArea').val('');
            $('#resultadosAnalisis').removeClass('visible');
        }

        // Registro de Service Worker para PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('./sw.js').then(function(reg) {
                    console.log('ServiceWorker activo:', reg.scope);
                }, function(err) {
                    console.log('Error en ServiceWorker:', err);
                });
            });
        }
    </script>
</body>
</html>
