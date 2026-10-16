let graficosRenderizados = false;
let filtroSiegeAtual = null;

// SISTEMA DE LOGIN SEGURO (Mecanismo oculto Base64)
window._a = function(i) { return btoa(i) === t_auth; };
if (sessionStorage.getItem('_auth') === '1') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appContent').style.display = 'flex';
    
    // --> GARANTIA: Se a aba Sieges estiver ativa no recarregamento, renderiza o gráfico!
    if (document.getElementById('tab-geral').classList.contains('active')) {
        setTimeout(() => { renderizarGraficos(); graficosRenderizados = true; }, 50);
    }
}

function _vAccess() {
    const input = document.getElementById('passInput').value;
    if (window._a(input)) {
        sessionStorage.setItem('_auth', '1');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContent').style.display = 'flex';
        if (document.getElementById('tab-geral').classList.contains('active') && !graficosRenderizados) {
            setTimeout(() => { renderizarGraficos(); graficosRenderizados = true; }, 50);
        }
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

document.getElementById('passInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') _vAccess();
});

function atualizarPosicaoFiltros() {
    const header = document.getElementById('insightsStickyHeader');
    if(header) {
        const h = header.offsetHeight + 60; 
        document.querySelectorAll('.filter-panel-sticky').forEach(el => { el.style.top = (h - 1) + 'px'; });
    }
}
window.addEventListener('resize', atualizarPosicaoFiltros);

function mudarAba(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
    
    if (tabId === 'tab-geral' && !graficosRenderizados && sessionStorage.getItem('_auth') === '1') { 
        setTimeout(() => { renderizarGraficos(); graficosRenderizados = true; }, 50); 
    }
    if (tabId === 'tab-insights') { setTimeout(atualizarPosicaoFiltros, 100); }
}

function toggleSiege(id) {
    const content = document.getElementById('content_' + id);
    const chev = document.getElementById('chev_' + id);
    const header = document.getElementById('header_' + id);
    if (content.style.display === 'block') { 
        content.style.display = 'none'; 
        chev.classList.remove('open');
        header.classList.remove('open');
    } else { 
        content.style.display = 'block'; 
        chev.classList.add('open'); 
        header.classList.add('open');
    }
}

function filtrarPorSiege(siegeId, dataSiege) {
    filtroSiegeAtual = siegeId;
    document.getElementById('siegeFilterIdTxt').innerText = siegeId;
    document.getElementById('siegeFilterDataTxt').innerText = "• " + dataSiege;
    document.getElementById('siegeFilterBanner').style.display = 'block';
    
    const btnInsights = document.getElementById('nav-insights');
    mudarAba('tab-insights', btnInsights);
    filtrarDecksGlobais();
    setTimeout(atualizarPosicaoFiltros, 100);
}

function limparFiltroSiege() {
    filtroSiegeAtual = null;
    document.getElementById('siegeFilterBanner').style.display = 'none';
    filtrarDecksGlobais();
    setTimeout(atualizarPosicaoFiltros, 100);
}

function voltarParaSiege() {
    const btnGeral = document.querySelector('.nav-link[onclick*="tab-geral"]');
    mudarAba('tab-geral', btnGeral);
    setTimeout(() => {
        const siegeCard = document.getElementById('header_' + filtroSiegeAtual);
        if (siegeCard) {
            siegeCard.scrollIntoView({behavior: 'smooth', block: 'center'});
            if (!siegeCard.classList.contains('open')) toggleSiege(filtroSiegeAtual);
        }
    }, 150);
}

function aplicarFiltro(gridId, criterio, limite, btn) {
    const grupo = btn.parentElement;
    grupo.querySelectorAll('.jump-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const grid = document.getElementById(gridId);
    grid.dataset.limit = limite; 
    
    let cards = Array.from(grid.querySelectorAll('.deck-card'));
    cards.forEach(c => c.style.display = 'block');

    if (criterio === 'wr') { cards.sort((a, b) => parseFloat(b.dataset.wr) - parseFloat(a.dataset.wr) || parseFloat(b.dataset.lutas) - parseFloat(a.dataset.lutas)); }
    else if (criterio === 'wr_asc') { cards.sort((a, b) => parseFloat(a.dataset.wr) - parseFloat(b.dataset.wr) || parseFloat(b.dataset.lutas) - parseFloat(a.dataset.lutas)); }
    else if (criterio === 'lutas') { cards.sort((a, b) => parseFloat(b.dataset.lutas) - parseFloat(a.dataset.lutas) || parseFloat(b.dataset.wr) - parseFloat(a.dataset.wr)); }
    else if (criterio === 'default') { cards.sort((a, b) => parseFloat(a.dataset.idx) - parseFloat(b.dataset.idx)); }

    cards.forEach(c => grid.appendChild(c));
    filtrarDecksGlobais(); 
}

function filtrarDecksGlobais() {
    const termo = document.getElementById('buscaMonstro').value.toLowerCase();
    ['gridAtaques', 'gridDefesas'].forEach(gridId => {
        const grid = document.getElementById(gridId);
        const cards = Array.from(grid.querySelectorAll('.deck-card'));
        const limite = parseInt(grid.dataset.limit || "0");
        let visibleCount = 0;
        
        cards.forEach(card => {
            const isMatch = card.getAttribute('data-search').includes(termo);
            const isInSiege = filtroSiegeAtual ? card.getAttribute('data-sieges').includes(filtroSiegeAtual) : true;

            if (isMatch && isInSiege) {
                if (limite === 0 || visibleCount < limite) { 
                    card.style.display = 'block'; 
                    visibleCount++;
                } else { 
                    card.style.display = 'none'; 
                }
            } else { 
                card.style.display = 'none'; 
            }
        });
    });
}

function filtrarFerramentas(cat, btn) {
    const grupo = btn.parentElement;
    grupo.querySelectorAll('.jump-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const cards = document.querySelectorAll('.tool-card');
    cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function renderizarLogs(dbLocal, isDefesa) {
    let html = "";
    const sieges = Object.keys(dbLocal).sort((a,b) => b - a);
    sieges.forEach(sId => {
        let headerLimpo = cabecalhosModal[sId] || `<div style='padding: 10px 0;'>Siege #${sId}</div>`;
        html += `<div style="margin-bottom:20px; border-radius:8px; overflow:hidden; border:1px solid var(--border);"><div style="background:#252530; padding: 0 20px; border-bottom: 1px solid var(--border);">${headerLimpo}</div><div style="padding:15px; background:var(--bg-card);">`;
        dbLocal[sId].forEach(log => {
            const stCls = log.venceu ? "win" : "loss";
            html += `
            <div class="log-entry ${stCls}">
                <div style="flex: 1; min-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <span style="font-weight:bold;">👤 ${log.jogador}</span><br>
                    <span style="font-size: 12px; color: var(--text-sec);">⚔️ vs ${log.guild_adv}</span>
                </div>
                <div class="log-team">
                    <img src="${URL_ICONES}${log.icons[0]}" title="${log.nomes[0]}">
                    <img src="${URL_ICONES}${log.icons[1]}" title="${log.nomes[1]}">
                    <img src="${URL_ICONES}${log.icons[2]}" title="${log.nomes[2]}">
                </div>
                <div style="font-weight:bold; text-align:right; width:80px;" class="${stCls}">${log.venceu ? "Vitória" : "Derrota"}</div>
            </div>`;
        });
        html += `</div></div>`;
    });
    return html || "<p>Sem dados.</p>";
}

function injetarImagensModal(k) {
    const ids = k.split('_');
    let html = '';
    ids.forEach(id => { html += `<img src="${URL_ICONES}${iconesMap[id] || 'default.png'}" style="width: 44px; height: 44px; border-radius: 6px; border: 1px solid #777;">`; });
    document.getElementById('modalIcons').innerHTML = html;
}

function abrirModalAtaque(k, t) {
    document.getElementById('modalTitle').innerText = "⚔️ Histórico do Ataque: " + t;
    injetarImagensModal(k);
    document.getElementById('modalBody').innerHTML = renderizarLogs(dbAtaques[k] || {}, false);
    document.getElementById('historicoModal').style.display = "block";
}

function abrirModalDefesa(k, t) {
    document.getElementById('modalTitle').innerText = "🛡️ Histórico da Defesa: " + t;
    injetarImagensModal(k);
    document.getElementById('modalBody').innerHTML = renderizarLogs(dbDefesas[k] || {}, true);
    document.getElementById('historicoModal').style.display = "block";
}

function fecharModal() { document.getElementById('historicoModal').style.display = "none"; }
window.onclick = function(e) { if(e.target == document.getElementById('historicoModal')) fecharModal(); }
window.onscroll = function() { document.getElementById("btnTopo").style.display = (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) ? "block" : "none"; };

function destacarMob(el) {
    const slot = el.parentElement;
    const mobs = Array.from(slot.querySelectorAll('.def-mob'));
    mobs.forEach(m => { m.classList.remove('mob-primary'); m.classList.add('mob-alt'); });
    el.classList.remove('mob-alt'); el.classList.add('mob-primary');
    const idx = mobs.indexOf(el);
    mobs.splice(idx, 1); mobs.unshift(el);
    slot.innerHTML = '';
    mobs.forEach((m, i) => {
        if (i > 0) { const sep = document.createElement('div'); sep.className = 'alt-badge'; sep.innerText = '/'; slot.appendChild(sep); }
        slot.appendChild(m);
    });
}

// --- NOVA FUNÇÃO: MUDAR TEMPORADA ---
function mudarTemporada(temp) {
    // 1. Oculta/Exibe Sieges na Aba Visão Geral
    document.querySelectorAll('.siege-wrapper').forEach(el => {
        el.style.display = (temp === 'Todas' || el.dataset.temporada === temp) ? 'block' : 'none';
    });
    
    // 2. Alterna as Grids de Ataques e Defesas
    ['ataquesContainer', 'defesasContainer'].forEach(containerId => {
        const container = document.getElementById(containerId);
        if(!container) return;
        const grids = container.querySelectorAll('.grid-season');
        grids.forEach(g => {
            if(g.dataset.temp === temp) {
                g.classList.add('active');
            } else {
                g.classList.remove('active');
            }
        });
        
        // Clica automaticamente no botão "Padrão" para resetar os filtros ao mudar de Season
        const btnPadrao = container.parentElement.querySelector('.jump-btn');
        if(btnPadrao) btnPadrao.click();
    });
}

// --- ATUALIZAÇÃO DA FUNÇÃO APLICAR FILTRO ---
function aplicarFiltro(containerId, criterio, limite, btn) {
    const grupo = btn.parentElement;
    grupo.querySelectorAll('.jump-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const container = document.getElementById(containerId);
    // Em vez de pegar a grid fixa, pega a grid da temporada que está ativa!
    const gridActive = container.querySelector('.grid-season.active');
    if(!gridActive) return;

    gridActive.dataset.limit = limite; 
    
    let cards = Array.from(gridActive.querySelectorAll('.deck-card'));
    cards.forEach(c => c.style.display = 'block');

    if (criterio === 'wr') { cards.sort((a, b) => parseFloat(b.dataset.wr) - parseFloat(a.dataset.wr) || parseFloat(b.dataset.lutas) - parseFloat(a.dataset.lutas)); }
    else if (criterio === 'wr_asc') { cards.sort((a, b) => parseFloat(a.dataset.wr) - parseFloat(b.dataset.wr) || parseFloat(b.dataset.lutas) - parseFloat(a.dataset.lutas)); }
    else if (criterio === 'lutas') { cards.sort((a, b) => parseFloat(b.dataset.lutas) - parseFloat(a.dataset.lutas) || parseFloat(b.dataset.wr) - parseFloat(a.dataset.wr)); }
    else if (criterio === 'default') { cards.sort((a, b) => parseFloat(a.dataset.idx) - parseFloat(b.dataset.idx)); }

    cards.forEach(c => gridActive.appendChild(c));
    filtrarDecksGlobais(); 
}

// --- ATUALIZAÇÃO DA BUSCA GLOBAL ---
function filtrarDecksGlobais() {
    const termo = document.getElementById('buscaMonstro').value.toLowerCase();
    ['ataquesContainer', 'defesasContainer'].forEach(containerId => {
        const container = document.getElementById(containerId);
        if(!container) return;
        const gridActive = container.querySelector('.grid-season.active');
        if(!gridActive) return;
        
        const cards = Array.from(gridActive.querySelectorAll('.deck-card'));
        const limite = parseInt(gridActive.dataset.limit || "0");
        let visibleCount = 0;
        
        cards.forEach(card => {
            const isMatch = card.getAttribute('data-search').includes(termo);
            const isInSiege = filtroSiegeAtual ? card.getAttribute('data-sieges').includes(filtroSiegeAtual) : true;

            if (isMatch && isInSiege) {
                if (limite === 0 || visibleCount < limite) { 
                    card.style.display = 'block'; 
                    visibleCount++;
                } else { card.style.display = 'none'; }
            } else { card.style.display = 'none'; }
        });
    });
}