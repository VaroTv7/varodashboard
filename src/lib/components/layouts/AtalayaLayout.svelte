<script lang="ts">
	import AtalayaPanel from './AtalayaPanel.svelte';
	let {
		settings = {} as Record<string, unknown>,
		services = { groups: [] } as { groups: Array<{ name: string; icon: string; services: Array<Record<string, unknown>> }> },
		scripts = { scripts: [] } as { scripts: Array<Record<string, unknown>> },
		bookmarks = { groups: [] } as { groups: Array<{ name: string; bookmarks: Array<{ name: string; url: string }> }> },
		statuses = {} as Record<string, string>,
		searchQuery = '',
		onOpenSettings = () => {},
		onSearch = (_q: string) => {},
	}: {
		settings: Record<string, unknown>;
		services: { groups: Array<{ name: string; icon: string; services: Array<Record<string, unknown>> }> };
		scripts: { scripts: Array<Record<string, unknown>> };
		bookmarks: { groups: Array<{ name: string; bookmarks: Array<{ name: string; url: string }> }> };
		statuses: Record<string, string>;
		searchQuery: string;
		onOpenSettings: () => void;
		onSearch: (q: string) => void;
	} = $props();

	const q = $derived(searchQuery.toLowerCase());
	const allServices = $derived(
		(services?.groups || []).flatMap(g => g.services.map(s => ({ ...s, group: g.name })))
			.filter(s => !q || (s.name as string || '').toLowerCase().includes(q) || (s.description as string || '').toLowerCase().includes(q))
	);
	const filteredScripts = $derived(
		(scripts?.scripts || []).filter(s => !q || (s.name as string || '').toLowerCase().includes(q))
	);
	const filteredBookmarks = $derived(
		(bookmarks?.groups || []).flatMap(g => g.bookmarks.map(b => ({ ...b, group: g.name })))
			.filter(b => !q || b.name.toLowerCase().includes(q))
	);
	const onlineCount = $derived(Object.values(statuses).filter(s => s === 'online').length);
	const offlineCount = $derived(Object.values(statuses).filter(s => s === 'offline').length);
	const totalServices = $derived(allServices.length);

	let now = $state(new Date());
	$effect(() => { const id = setInterval(() => now = new Date(), 1000); return () => clearInterval(id); });
	const timeStr = $derived(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
	const dateStr = $derived(now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase());

	// Fake vitals for visual richness
	let cpu = $state(23); let mem = $state(41); let temp = $state(44);
	$effect(() => {
		const id = setInterval(() => {
			cpu = Math.min(100, Math.max(5, cpu + (Math.random() - 0.5) * 8));
			mem = Math.min(100, Math.max(10, mem + (Math.random() - 0.5) * 3));
			temp = Math.min(85, Math.max(30, temp + (Math.random() - 0.5) * 2));
		}, 2000);
		return () => clearInterval(id);
	});

	// Activity log entries
	const logEntries = $derived([
		...allServices.map(s => ({
			time: timeStr,
			level: statuses[s.name as string] === 'online' ? 'OK' : 'WARN',
			msg: `${(s.name as string).toLowerCase()} → ${statuses[s.name as string] || 'checking'}`,
		}))
	]);
</script>

<div class="ata">
	<!-- TOP BAR -->
	<header class="ata__top">
		<div class="ata__top-l">
			<span class="ata__badge">⟡ ÍNDICE</span>
			<span class="ata__brand">{(settings.title as string || 'varodashboard').toUpperCase()}</span>
			<span class="ata__sep">│</span>
			<span class="ata__dim">atalaya</span>
			<span class="ata__sep">│</span>
			<span class="ata__dim">{searchQuery ? `filter: "${searchQuery}"` : 'system.monitor'}</span>
		</div>
		<div class="ata__top-c">
			<span class="ata__pr">▸</span>
			<input class="ata__si" type="text" value={searchQuery} oninput={(e) => onSearch((e.target as HTMLInputElement).value)} placeholder="filter..." spellcheck="false" />
		</div>
		<div class="ata__top-r">
			<span class="ata__time">{timeStr}</span>
			<span class="ata__sep">│</span>
			<span class="ata__dim">{dateStr}</span>
			<button class="ata__gear" onclick={onOpenSettings}>⚙</button>
		</div>
	</header>

	<!-- BENTO GRID -->
	<div class="ata__grid">
		<!-- COL1: Tree -->
		<div class="ata__c1">
			<AtalayaPanel title="bóveda.árbol" count={totalServices}>
				<div class="ata__tree">
					{#each services?.groups || [] as group (group.name)}
						<div class="ata__tg">
							<span class="ata__tf">▸ {group.name.toLowerCase()}</span>
							{#each group.services as svc (svc.name)}
								{@const nm = svc.name as string}
								{@const st = statuses[nm] || 'unknown'}
								{@const show = !q || nm.toLowerCase().includes(q)}
								{#if show}
									<a href={svc.url as string} target="_blank" rel="noopener" class="ata__ti">
										<span class="ata__td" class:ata__td--on={st==='online'} class:ata__td--off={st==='offline'}></span>
										{nm.toLowerCase()}
									</a>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</AtalayaPanel>

			<AtalayaPanel title="tráfico · tx/rx">
				<div class="ata__wave">
					<svg viewBox="0 0 200 60" preserveAspectRatio="none">
						<path class="ata__wave1" d="M0,30 Q25,10 50,30 T100,30 T150,30 T200,30" />
						<path class="ata__wave2" d="M0,35 Q25,50 50,35 T100,35 T150,35 T200,35" />
					</svg>
					<div class="ata__wave-stats">
						<span>TX <b>71 kB/s</b></span>
						<span>RX <b>4 kB/s</b></span>
					</div>
				</div>
			</AtalayaPanel>
		</div>

		<!-- COL2: Main area -->
		<div class="ata__c2">
			<!-- Row 1: Identity + Stats -->
			<div class="ata__r1">
				<AtalayaPanel title="atalaya · radar en vivo">
					<div class="ata__radar">
						<div class="ata__radar-circle">
							<div class="ata__radar-sweep"></div>
							{#each allServices as svc, i (svc.name)}
								{@const st = statuses[svc.name as string] || 'unknown'}
								{@const angle = (i / allServices.length) * 360}
								{@const dist = 20 + Math.random() * 25}
								<div class="ata__radar-dot" class:ata__radar-dot--on={st==='online'} class:ata__radar-dot--off={st==='offline'}
									style="left: {50 + dist * Math.cos(angle * Math.PI / 180)}%; top: {50 + dist * Math.sin(angle * Math.PI / 180)}%;"
									title={svc.name as string}></div>
							{/each}
						</div>
					</div>
				</AtalayaPanel>

				<AtalayaPanel title="system.identity">
					<div class="ata__id">
						<div class="ata__id-brand">{(settings.title as string || 'varodashboard').toLowerCase()}</div>
						<div class="ata__id-codes">P · R · I · V · A · D · O</div>
						<div class="ata__id-sub">bóveda · ponente · ent/re · sellado · vigilado</div>
						<table class="ata__id-table"><tbody>
							<tr><td>services</td><td class="ata__id-val">{totalServices}</td><td>online</td><td class="ata__id-val ata__g">{onlineCount}</td></tr>
							<tr><td>scripts</td><td class="ata__id-val">{filteredScripts.length}</td><td>bookmarks</td><td class="ata__id-val">{filteredBookmarks.length}</td></tr>
							<tr><td>latencia</td><td class="ata__id-val">12ms</td><td>confiables</td><td class="ata__id-val">{onlineCount}/{totalServices}</td></tr>
						</tbody></table>
					</div>
				</AtalayaPanel>
			</div>

			<!-- Row 2: Services + Log -->
			<div class="ata__r2">
				<AtalayaPanel title="active.services" count={totalServices}>
					<div class="ata__sg">
						{#each allServices as svc (svc.name)}
							{@const st = statuses[svc.name as string] || 'unknown'}
							<a href={svc.url as string} target="_blank" rel="noopener" class="ata__sc" class:ata__sc--on={st==='online'}>
								<span class="ata__sd" class:ata__sd--on={st==='online'} class:ata__sd--off={st==='offline'}></span>
								<span class="ata__sn">{(svc.name as string).toUpperCase()}</span>
								<span class="ata__ss">{(svc.description as string || '').toLowerCase()}</span>
								<span class="ata__su">{(svc.url as string || '').replace(/https?:\/\//, '')}</span>
							</a>
						{/each}
					</div>
				</AtalayaPanel>

				<AtalayaPanel title="registro de actividad">
					<div class="ata__log">
						{#each logEntries.slice(0, 10) as entry, i (i)}
							<div class="ata__le" class:ata__le--ok={entry.level==='OK'} class:ata__le--warn={entry.level==='WARN'}>
								<span class="ata__lt">{entry.time}</span>
								<span class="ata__ll" class:ata__ll--ok={entry.level==='OK'} class:ata__ll--warn={entry.level==='WARN'}>{entry.level}</span>
								<span class="ata__lm">{entry.msg}</span>
							</div>
						{/each}
					</div>
				</AtalayaPanel>
			</div>

			<!-- Row 3: Scripts + Bookmarks -->
			<div class="ata__r3">
				{#if filteredScripts.length > 0}
					<AtalayaPanel title="exec.scripts" count={filteredScripts.length}>
						<div class="ata__scripts">
							{#each filteredScripts as script (script.id)}
								<div class="ata__scr"><span class="ata__pr">$</span> <b>{(script.name as string).toLowerCase()}</b> <span class="ata__dim">— {(script.description as string || '').toLowerCase()}</span></div>
							{/each}
						</div>
					</AtalayaPanel>
				{/if}
				{#if filteredBookmarks.length > 0}
					<AtalayaPanel title="acceso.log" count={filteredBookmarks.length}>
						<div class="ata__bm">
							{#each filteredBookmarks as bm (bm.name)}
								<a href={bm.url} target="_blank" rel="noopener" class="ata__bl">
									<span class="ata__bk">{bm.group?.toUpperCase()}</span>
									<span>{bm.name.toLowerCase()}</span>
									<span class="ata__dim">→ {bm.url.replace(/https?:\/\//, '').split('/')[0]}</span>
								</a>
							{/each}
						</div>
					</AtalayaPanel>
				{/if}
			</div>
		</div>

		<!-- COL3: Right -->
		<div class="ata__c3">
			<AtalayaPanel title="sistema.vitales">
				<div class="ata__vit">
					<div class="ata__vr"><span class="ata__vk">CPU</span><div class="ata__vb"><div class="ata__vf ata__vf--cpu" style="width:{cpu}%"></div></div><span class="ata__vv">{Math.round(cpu)}%</span></div>
					<div class="ata__vr"><span class="ata__vk">MEM</span><div class="ata__vb"><div class="ata__vf ata__vf--mem" style="width:{mem}%"></div></div><span class="ata__vv">{Math.round(mem)}%</span></div>
					<div class="ata__vr"><span class="ata__vk">TEMP</span><div class="ata__vb"><div class="ata__vf ata__vf--tmp" style="width:{temp}%"></div></div><span class="ata__vv">{Math.round(temp)}°</span></div>
				</div>
			</AtalayaPanel>

			<AtalayaPanel title="status.monitor">
				<div class="ata__mon">
					{#each allServices as svc (svc.name)}
						{@const st = statuses[svc.name as string] || 'unknown'}
						<div class="ata__mr">
							<span class="ata__md" class:ata__md--on={st==='online'} class:ata__md--off={st==='offline'}></span>
							<span class="ata__mn">{(svc.name as string).toLowerCase()}</span>
							<div class="ata__mb"><div class="ata__mf" class:ata__mf--on={st==='online'} class:ata__mf--off={st==='offline'}></div></div>
							<span class="ata__ms" class:ata__ms--on={st==='online'} class:ata__ms--off={st==='offline'}>{st==='online'?'ON':st==='offline'?'OFF':'---'}</span>
						</div>
					{/each}
				</div>
			</AtalayaPanel>

			<AtalayaPanel title="system.info">
				<div class="ata__si2">
					<div class="ata__sr"><span class="ata__sk">theme</span><span class="ata__sv">atalaya</span></div>
					<div class="ata__sr"><span class="ata__sk">services</span><span class="ata__sv">{totalServices}</span></div>
					<div class="ata__sr"><span class="ata__sk">online</span><span class="ata__sv ata__g">{onlineCount}</span></div>
					<div class="ata__sr"><span class="ata__sk">offline</span><span class="ata__sv ata__r">{offlineCount}</span></div>
					<div class="ata__sr"><span class="ata__sk">scripts</span><span class="ata__sv">{filteredScripts.length}</span></div>
					<div class="ata__sr"><span class="ata__sk">bookmarks</span><span class="ata__sv">{filteredBookmarks.length}</span></div>
				</div>
			</AtalayaPanel>
		</div>
	</div>

	<!-- TICKER -->
	<div class="ata__ticker">
		<div class="ata__ticker-scroll">
			<span>⟡ "una sola gesta de huellas aquí dentro" — varoserver vta v22.0 ⟡ sistema vigilado · bóveda sellada · nodos confiables: {onlineCount}/{totalServices} · latencia: 12ms ⟡ atalaya: modo surveillance activo ⟡ cifrado: AES-256-GCM · protocolo: TLS 1.3 ⟡</span>
		</div>
	</div>

	<!-- BOTTOM BAR -->
	<footer class="ata__bot">
		<span>services: {totalServices}</span><span class="ata__sep">│</span>
		<span>online: <span class="ata__g">{onlineCount}</span></span><span class="ata__sep">│</span>
		<span>offline: <span class="ata__r">{offlineCount}</span></span><span class="ata__sep">│</span>
		<span>scripts: {filteredScripts.length}</span><span class="ata__sep">│</span>
		<span>cpu: {Math.round(cpu)}%</span><span class="ata__sep">│</span>
		<span>mem: {Math.round(mem)}%</span>
		<span class="ata__botv">varodashboard v1.0 · atalaya</span>
	</footer>
</div>

<style>
	.ata { height:100vh; display:flex; flex-direction:column; font-family:'JetBrains Mono','Fira Code',monospace;
		background:#060d1a; color:#b8dce8; font-size:clamp(0.55rem,0.45vw+0.3rem,0.8rem); overflow:hidden;
		background-image:
			radial-gradient(circle,rgba(0,230,200,0.03) 1px,transparent 1px),
			linear-gradient(rgba(0,230,200,0.015) 1px,transparent 1px),
			linear-gradient(90deg,rgba(0,230,200,0.015) 1px,transparent 1px);
		background-size:clamp(14px,1.2vw,24px) clamp(14px,1.2vw,24px),clamp(60px,5vw,100px) clamp(60px,5vw,100px),clamp(60px,5vw,100px) clamp(60px,5vw,100px); }
	/* Scan-lines + vignette + edge glow */
	.ata::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:998;
		background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.4) 100%);
		box-shadow:inset 0 0 120px rgba(0,230,200,0.03); }
	.ata::after { content:''; position:fixed; inset:0; pointer-events:none; z-index:999;
		background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px);
		animation:flicker 8s ease-in-out infinite; }
	@keyframes flicker { 0%,97%,100%{opacity:1} 98%{opacity:0.97} 99%{opacity:1} }
	.ata__g { color:#00ff88!important; } .ata__r { color:#ff3355!important; }
	.ata__dim { color:#2d5568; } .ata__sep { color:#1a3545; } .ata__pr { color:#00e5c8; font-weight:700; }

	.ata__top { display:flex; align-items:center; justify-content:space-between; padding:0 clamp(8px,0.6vw,16px);
		height:clamp(26px,2.5vh,36px); background:#050b14; border-bottom:1px solid rgba(0,230,200,0.15); flex-shrink:0; z-index:200; position:relative; }
	.ata__top-l,.ata__top-r { display:flex; align-items:center; gap:clamp(4px,0.4vw,10px); }
	.ata__top-c { display:flex; align-items:center; gap:4px; flex:1; max-width:clamp(180px,16vw,350px); margin:0 auto; }
	.ata__badge { background:rgba(0,230,200,0.08); border:1px solid rgba(0,230,200,0.2); padding:1px 6px;
		border-radius:2px; color:#00e5c8; font-size:0.5em; font-weight:700; letter-spacing:0.15em; }
	.ata__brand { color:#00e5c8; font-weight:700; letter-spacing:0.2em; font-size:clamp(0.5rem,0.4vw+0.3rem,0.75rem); }
	.ata__time { color:#00e5c8; font-weight:700; font-variant-numeric:tabular-nums; letter-spacing:0.1em; }
	.ata__gear { color:#6a98a8; padding:2px 6px; border-radius:2px; transition:all 100ms; }
	.ata__gear:hover { color:#00e5c8; background:rgba(0,230,200,0.08); }
	.ata__si { flex:1; background:none; border:none; outline:none; color:#b8dce8; font-family:inherit; font-size:0.9em; letter-spacing:0.05em; }
	.ata__si::placeholder { color:#1a3545; }

	.ata__grid { flex:1; display:grid; grid-template-columns:clamp(140px,11vw,230px) 1fr clamp(160px,13vw,280px);
		gap:clamp(3px,0.3vw,8px); padding:clamp(3px,0.3vw,8px); min-height:0; overflow:hidden; }
	.ata__c1,.ata__c2,.ata__c3 { display:flex; flex-direction:column; gap:clamp(3px,0.3vw,8px); min-height:0; overflow-y:auto; }
	.ata__r1,.ata__r2,.ata__r3 { display:grid; gap:clamp(3px,0.3vw,8px); min-height:0; }
	.ata__r1 { grid-template-columns:1fr 1fr; min-height:clamp(140px,22vh,280px); }
	.ata__r2 { grid-template-columns:1.3fr 0.7fr; flex:1; min-height:0; }
	.ata__r3 { grid-template-columns:1fr 1fr; }

	.ata__tree { display:flex; flex-direction:column; gap:1px; }
	.ata__tg { margin-bottom:clamp(2px,0.2vw,6px); }
	.ata__tf { color:#00e5c8; font-size:0.85em; font-weight:600; letter-spacing:0.1em; }
	.ata__ti { display:flex; align-items:center; gap:4px; padding:1px 0 1px 10px; color:#6a98a8;
		text-decoration:none; font-size:0.85em; transition:color 100ms; }
	.ata__ti:hover { color:#b8dce8; }
	.ata__td { width:4px; height:4px; border-radius:50%; background:#2d5568; flex-shrink:0; }
	.ata__td--on { background:#00ff88; box-shadow:0 0 4px rgba(0,255,136,0.5); }
	.ata__td--off { background:#ff3355; }

	.ata__wave { position:relative; }
	.ata__wave svg { width:100%; height:clamp(40px,5vh,80px); }
	.ata__wave1 { fill:none; stroke:#00e5c8; stroke-width:1.5; opacity:0.6; }
	.ata__wave2 { fill:none; stroke:#00ff88; stroke-width:1; opacity:0.4; }
	.ata__wave-stats { display:flex; justify-content:space-between; font-size:0.8em; color:#2d5568; margin-top:2px; }
	.ata__wave-stats b { color:#00e5c8; }

	.ata__radar { display:flex; align-items:center; justify-content:center; height:100%; }
	.ata__radar-circle { position:relative; width:clamp(100px,12vw,200px); height:clamp(100px,12vw,200px);
		border:1px solid rgba(0,230,200,0.15); border-radius:50%;
		background:radial-gradient(circle,rgba(0,230,200,0.03) 0%,transparent 70%); }
	.ata__radar-circle::before,.ata__radar-circle::after { content:''; position:absolute; border-radius:50%;
		border:1px solid rgba(0,230,200,0.08); }
	.ata__radar-circle::before { inset:20%; } .ata__radar-circle::after { inset:40%; }
	.ata__radar-sweep { position:absolute; inset:0; border-radius:50%; overflow:hidden; }
	.ata__radar-sweep::before { content:''; position:absolute; top:50%; left:50%; width:50%; height:2px;
		background:linear-gradient(90deg,rgba(0,230,200,0.6),transparent); transform-origin:left center;
		animation:radarSweep 4s linear infinite; }
	@keyframes radarSweep { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
	.ata__radar-dot { position:absolute; width:5px; height:5px; border-radius:50%; transform:translate(-50%,-50%);
		background:#2d5568; transition:all 300ms; }
	.ata__radar-dot--on { background:#00ff88; box-shadow:0 0 6px rgba(0,255,136,0.6); animation:pulse 2s ease infinite; }
	.ata__radar-dot--off { background:#ff3355; box-shadow:0 0 4px rgba(255,51,85,0.4); }
	@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

	.ata__id { display:flex; flex-direction:column; gap:clamp(4px,0.4vw,10px); }
	.ata__id-brand { font-size:clamp(0.9rem,1.2vw,1.8rem); font-weight:800; color:#b8dce8; letter-spacing:0.08em; }
	.ata__id-codes { color:#00e5c8; font-size:0.8em; letter-spacing:0.3em; font-weight:600; }
	.ata__id-sub { color:#2d5568; font-size:0.75em; letter-spacing:0.1em; }
	.ata__id-table { width:100%; border-collapse:collapse; font-size:0.85em; }
	.ata__id-table td { padding:clamp(1px,0.15vw,4px) 0; color:#6a98a8; border-bottom:1px solid rgba(0,230,200,0.05); }
	.ata__id-val { color:#b8dce8; font-weight:700; text-align:right; padding-right:clamp(6px,0.5vw,14px); }

	.ata__sg { display:grid; grid-template-columns:repeat(auto-fill,minmax(clamp(120px,9vw,200px),1fr));
		gap:clamp(3px,0.3vw,8px); flex:1; align-content:start; }
	.ata__sc { display:flex; flex-direction:column; gap:2px; padding:clamp(5px,0.4vw,10px);
		background:#0d1925; border:1px solid rgba(0,230,200,0.08); border-radius:2px;
		text-decoration:none; color:#b8dce8; transition:all 150ms; position:relative; overflow:hidden; }
	.ata__sc::after { content:''; position:absolute; bottom:0; left:0; height:2px; width:100%;
		background:linear-gradient(90deg,#00e5c8,#00ff88); opacity:0; transition:opacity 150ms; }
	.ata__sc--on::after { opacity:0.5; }
	.ata__sc:hover { border-color:rgba(0,230,200,0.3); background:#0f1e2d;
		box-shadow:0 0 16px rgba(0,230,200,0.06),inset 0 0 20px rgba(0,230,200,0.02); }
	.ata__sd { width:5px; height:5px; border-radius:50%; background:#2d5568; flex-shrink:0; display:inline-block; }
	.ata__sd--on { background:#00ff88; box-shadow:0 0 5px rgba(0,255,136,0.5); }
	.ata__sd--off { background:#ff3355; }
	.ata__sn { font-size:0.85em; font-weight:600; letter-spacing:0.06em; }
	.ata__ss { font-size:0.75em; color:#2d5568; }
	.ata__su { font-size:0.7em; color:#1a3545; }

	.ata__log { display:flex; flex-direction:column; gap:1px; flex:1; overflow-y:auto; font-size:0.85em; }
	.ata__le { display:flex; gap:clamp(4px,0.4vw,8px); padding:clamp(1px,0.1vw,3px) 0; border-bottom:1px solid rgba(0,230,200,0.03); }
	.ata__lt { color:#2d5568; font-variant-numeric:tabular-nums; white-space:nowrap; }
	.ata__ll { font-weight:700; min-width:3em; }
	.ata__ll--ok { color:#00ff88; } .ata__ll--warn { color:#ffaa00; }
	.ata__lm { color:#6a98a8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

	.ata__scripts { display:flex; flex-direction:column; gap:clamp(2px,0.2vw,5px); font-size:0.9em; }
	.ata__scr { padding:1px 0; }

	.ata__bm { display:flex; flex-direction:column; gap:1px; font-size:0.85em; }
	.ata__bl { display:flex; gap:clamp(4px,0.3vw,8px); padding:1px 0; color:#6a98a8; text-decoration:none; transition:color 100ms; }
	.ata__bl:hover { color:#00e5c8; }
	.ata__bk { color:#00e5c8; font-size:0.8em; font-weight:700; min-width:4em; letter-spacing:0.08em; }

	.ata__vit { display:flex; flex-direction:column; gap:clamp(4px,0.3vw,8px); }
	.ata__vr { display:flex; align-items:center; gap:clamp(4px,0.3vw,8px); font-size:0.85em; }
	.ata__vk { color:#6a98a8; min-width:3em; font-weight:600; }
	.ata__vb { flex:1; height:clamp(6px,0.5vw,10px); background:rgba(0,230,200,0.06); border-radius:1px; overflow:hidden; }
	.ata__vf { height:100%; border-radius:1px; transition:width 500ms ease; }
	.ata__vf--cpu { background:linear-gradient(90deg,#00e5c8,#00ff88); box-shadow:0 0 4px rgba(0,255,136,0.3); }
	.ata__vf--mem { background:linear-gradient(90deg,#00aaff,#00e5c8); box-shadow:0 0 4px rgba(0,170,255,0.3); }
	.ata__vf--tmp { background:linear-gradient(90deg,#ffaa00,#ff6644); box-shadow:0 0 4px rgba(255,170,0,0.3); }
	.ata__vv { color:#b8dce8; font-weight:700; font-variant-numeric:tabular-nums; min-width:3em; text-align:right; }

	.ata__mon { display:flex; flex-direction:column; gap:clamp(2px,0.15vw,4px); }
	.ata__mr { display:flex; align-items:center; gap:4px; font-size:0.85em; padding:1px 0; }
	.ata__md { width:4px; height:4px; border-radius:50%; background:#2d5568; flex-shrink:0; }
	.ata__md--on { background:#00ff88; box-shadow:0 0 4px rgba(0,255,136,0.5); }
	.ata__md--off { background:#ff3355; }
	.ata__mn { color:#6a98a8; white-space:nowrap; }
	.ata__mb { flex:1; height:4px; background:rgba(0,230,200,0.06); border-radius:1px; overflow:hidden; margin:0 2px; }
	.ata__mf { height:100%; width:30%; background:#2d5568; border-radius:1px; transition:all 300ms; }
	.ata__mf--on { width:100%; background:linear-gradient(90deg,#00e5c8,#00ff88); }
	.ata__mf--off { width:60%; background:linear-gradient(90deg,#ff3355,#ff6644); }
	.ata__ms { font-weight:700; letter-spacing:0.1em; color:#2d5568; font-size:0.8em; }
	.ata__ms--on { color:#00ff88; } .ata__ms--off { color:#ff3355; }

	.ata__si2 { display:flex; flex-direction:column; gap:clamp(2px,0.15vw,4px); }
	.ata__sr { display:flex; justify-content:space-between; padding:1px 0; font-size:0.85em; border-bottom:1px solid rgba(0,230,200,0.04); }
	.ata__sk { color:#6a98a8; } .ata__sv { color:#b8dce8; font-weight:600; }

	.ata__bot { display:flex; align-items:center; gap:clamp(4px,0.4vw,10px); padding:0 clamp(8px,0.6vw,16px);
		height:clamp(20px,2vh,28px); background:#050b14; border-top:1px solid rgba(0,230,200,0.12);
		font-size:0.8em; color:#2d5568; letter-spacing:0.08em; flex-shrink:0; }
	.ata__botv { margin-left:auto; color:#1a3545; }

	@media(max-width:768px) {
		.ata__grid { grid-template-columns:1fr; }
		.ata__c1,.ata__c3 { display:none; }
		.ata__r1,.ata__r2,.ata__r3 { grid-template-columns:1fr; }
		.ata__ticker { display:none; }
	}
	@media(min-width:769px) and (max-width:1200px) {
		.ata__grid { grid-template-columns:1fr clamp(160px,14vw,240px); }
		.ata__c1 { display:none; }
		.ata__r1 { grid-template-columns:1fr 1fr; }
		.ata__r2 { grid-template-columns:1fr; }
	}
	@media(min-width:2560px) {
		.ata__sg { grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); }
	}

	/* === TICKER === */
	.ata__ticker { flex-shrink:0; height:clamp(16px,1.6vh,22px); background:#050b14;
		border-top:1px solid rgba(0,230,200,0.08); border-bottom:1px solid rgba(0,230,200,0.08);
		overflow:hidden; position:relative; }
	.ata__ticker::before { content:''; position:absolute; left:0; top:0; bottom:0; width:40px;
		background:linear-gradient(90deg,#050b14,transparent); z-index:1; }
	.ata__ticker::after { content:''; position:absolute; right:0; top:0; bottom:0; width:40px;
		background:linear-gradient(-90deg,#050b14,transparent); z-index:1; }
	.ata__ticker-scroll { display:flex; align-items:center; height:100%; white-space:nowrap;
		animation:tickerScroll 40s linear infinite; font-size:0.75em; color:#1a3545; letter-spacing:0.1em; }
	.ata__ticker-scroll span { padding:0 2em; }
	@keyframes tickerScroll { from{transform:translateX(100%)} to{transform:translateX(-100%)} }

	/* === TOP BAR GLOW === */
	.ata__top::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px;
		background:linear-gradient(90deg,transparent,rgba(0,230,200,0.3),rgba(0,255,136,0.15),rgba(0,230,200,0.3),transparent); }
</style>
