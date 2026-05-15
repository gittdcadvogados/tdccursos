-- Seed do curso: Tributação do Transporte Rodoviário na Reforma Tributária
-- Espelha o conteúdo real de produção (7 módulos · 57 aulas + 2 oficinas · 7 sessões ao vivo).
-- Cronograma oficial maio/2026. Datas de release_at e starts_at em BRT (UTC-03).
-- Idempotente: pode rodar mais de uma vez (on conflict do update). bunny_video_guid
-- é preenchido depois do upload no Bunny Stream.
-- Requer: migrations 0001..0006 aplicadas (release_at e live_sessions vêm da 0006).

-- =========================
-- Curso
-- =========================
insert into public.courses (slug, title, description, is_published)
values (
  'reforma-tributaria-transporte',
  'Tributação do Transporte Rodoviário na Reforma Tributária',
  'IBS, CBS, ICMS e a transição — impactos e estratégias para transportadoras, contadores e advogados tributaristas. Com Rafael Vieira, fiscal de tributos estaduais licenciado.',
  true
)
on conflict (slug) do update
  set title = excluded.title,
      description = excluded.description,
      is_published = excluded.is_published;

-- =========================
-- Módulos
-- =========================
with c as (select id from public.courses where slug = 'reforma-tributaria-transporte')
insert into public.modules (course_id, slug, title, position)
select c.id, m.slug, m.title, m.position
from c, (values
  ('tributacao-do-consumo',  'Módulo 1 — A Nova Tributação do Consumo',                 1),
  ('cargas',                 'Módulo 2 — IBS e CBS no Transporte Rodoviário de Cargas', 2),
  ('passageiros',            'Módulo 3 — IBS e CBS no Transporte de Passageiros',       3),
  ('creditos',               'Módulo 4 — Gestão de Créditos e Regimes Diferenciados',   4),
  ('icms-transicao',         'Módulo 5 — ICMS na Transição',                            5),
  ('obrigacoes-acessorias',  'Módulo 6 — Obrigações Acessórias e Documentos Fiscais',   6),
  ('estrategia',             'Módulo 7 — Estratégia e Planejamento na Transição',       7)
) as m(slug, title, position)
on conflict (course_id, slug) do update
  set title = excluded.title, position = excluded.position;

-- =========================
-- Aulas — Módulo 1 (8 aulas — libera 03/ago e 10/ago)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'tributacao-do-consumo'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('da-cf-88-ao-ibs-cbs-o-que-muda-na-estrutura-do-sistema-tributario-brasileiro', 'Da CF/88 ao IBS/CBS: o que muda na estrutura do sistema tributário brasileiro', 1, '2026-08-03 00:00:00-03'),
  ('o-tributo-dual-ibs-e-cbs-arquitetura-competencias-e-o-papel-do-comite-gestor', 'O tributo dual: IBS e CBS — arquitetura, competências e o papel do Comitê Gestor', 2, '2026-08-03 00:00:00-03'),
  ('contribuinte-e-nao-contribuinte-quem-esta-no-campo-de-incidencia', 'Contribuinte e não contribuinte: quem está no campo de incidência', 3, '2026-08-03 00:00:00-03'),
  ('fato-gerador-base-de-calculo-e-aliquotas-como-o-imposto-e-calculado', 'Fato gerador, base de cálculo e alíquotas: como o imposto é calculado', 4, '2026-08-03 00:00:00-03'),
  ('local-da-operacao-onde-o-ibs-e-a-cbs-sao-devidos', 'Local da operação: onde o IBS e a CBS são devidos', 5, '2026-08-10 00:00:00-03'),
  ('nao-cumulatividade-ampla-a-logica-dos-creditos-no-novo-sistema', 'Não cumulatividade ampla: a lógica dos créditos no novo sistema', 6, '2026-08-10 00:00:00-03'),
  ('o-cronograma-da-transicao-2026-a-2033-o-que-muda-em-cada-ano', 'O cronograma da transição: 2026 a 2033 — o que muda em cada ano', 7, '2026-08-10 00:00:00-03'),
  ('sintese-do-modulo-1-consolidando-o-novo-sistema-antes-de-entrar-no-transporte', 'Síntese do Módulo 1: consolidando o novo sistema antes de entrar no transporte', 8, '2026-08-10 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set title = excluded.title, position = excluded.position, release_at = excluded.release_at;

-- =========================
-- Aulas — Módulo 2 (11 aulas — libera 17/ago, 24/ago, 31/ago)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'cargas'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('incidencia-geral-o-transporte-rodoviario-de-cargas-como-servico-tributavel-pelo-ibs-cbs', 'Incidência geral: o transporte rodoviário de cargas como serviço tributável pelo IBS/CBS', 1, '2026-08-17 00:00:00-03'),
  ('transporte-rodoviario-iniciado-no-territorio-nacional-regras-de-incidencia-e-base-de-calculo', 'Transporte rodoviário iniciado no território nacional: regras de incidência e base de cálculo', 2, '2026-08-17 00:00:00-03'),
  ('transporte-de-cargas-proveniente-do-exterior-tributacao-na-entrada', 'Transporte de cargas proveniente do exterior: tributação na entrada', 3, '2026-08-17 00:00:00-03'),
  ('exportacao-de-servicos-de-transporte-o-fim-da-isencao-suspensao-e-a-nova-logica-do-credito', 'Exportação de serviços de transporte: o fim da isenção/suspensão e a nova lógica do crédito', 4, '2026-08-17 00:00:00-03'),
  ('split-payment-como-funciona-na-pratica-e-o-que-muda-no-fluxo-de-caixa-da-transportadora', 'Split payment: como funciona na prática e o que muda no fluxo de caixa da transportadora', 5, '2026-08-24 00:00:00-03'),
  ('subcontratacao-de-transporte-incidencia-responsabilidade-tributaria-e-aproveitamento-de-credito', 'Subcontratação de transporte: incidência, responsabilidade tributária e aproveitamento de crédito', 6, '2026-08-24 00:00:00-03'),
  ('a-informalidade-no-setor-e-a-pressao-por-formalizacao-ct-e-valido-como-condicao-de-credito-no-ibs-cbs', 'A informalidade no setor e a pressão por formalização: CT-e válido como condição de crédito no IBS/CBS', 7, '2026-08-24 00:00:00-03'),
  ('redespacho-regime-juridico-tributacao-e-gestao-de-creditos', 'Redespacho: regime jurídico, tributação e gestão de créditos', 8, '2026-08-24 00:00:00-03'),
  ('transporte-multimodal-e-intermodal-regras-aplicaveis-e-pontos-de-atencao', 'Transporte multimodal e intermodal: regras aplicáveis e pontos de atenção', 9, '2026-08-31 00:00:00-03'),
  ('segmentos-especiais-cargas-perigosas-frigorificadas-de-alto-valor-e-escoltadas', 'Segmentos especiais: cargas perigosas, frigorificadas, de alto valor e escoltadas', 10, '2026-08-31 00:00:00-03'),
  ('casos-praticos-aplicacao-do-ibs-cbs-em-operacoes-reais-de-transporte-de-cargas', 'Casos práticos: aplicação do IBS/CBS em operações reais de transporte de cargas', 11, '2026-08-31 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set title = excluded.title, position = excluded.position, release_at = excluded.release_at;

-- =========================
-- Aulas — Módulo 3 (5 aulas — libera 08/set, terça por feriado 07/set)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'passageiros'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('transporte-intermunicipal-e-interestadual-de-passageiros-incidencia-e-particularidades', 'Transporte intermunicipal e interestadual de passageiros: incidência e particularidades', 1, '2026-09-08 00:00:00-03'),
  ('transporte-publico-coletivo-urbano-imunidade-isencao-e-impacto-pratico-para-as-operadoras', 'Transporte público coletivo urbano: imunidade, isenção e impacto prático para as operadoras', 2, '2026-09-08 00:00:00-03'),
  ('transporte-internacional-de-passageiros-tributacao-e-tratados-internacionais', 'Transporte internacional de passageiros: tributação e tratados internacionais', 3, '2026-09-08 00:00:00-03'),
  ('transporte-escolar-fretamento-e-turistico-regime-aplicavel-e-pontos-de-atencao', 'Transporte escolar, fretamento e turístico: regime aplicável e pontos de atenção', 4, '2026-09-08 00:00:00-03'),
  ('fretamento-ocasional-vs-contrato-de-longo-prazo-impacto-tributario-e-revisao-contratual-na-transicao', 'Fretamento ocasional vs. contrato de longo prazo: impacto tributário e revisão contratual na transição', 5, '2026-09-08 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set title = excluded.title, position = excluded.position, release_at = excluded.release_at;

-- =========================
-- Aulas — Módulo 4 (11 aulas — libera 14/set, 21/set, 28/set)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'creditos'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('creditos-de-entradas-em-geral-principios-sistematica-e-operacionalizacao-no-ibs-cbs', 'Créditos de entradas em geral: princípios, sistemática e operacionalização no IBS/CBS', 1, '2026-09-14 00:00:00-03'),
  ('bens-de-capital-na-frota-creditos-de-ibs-cbs-na-aquisicao-de-caminhoes-implementos-e-veiculos', 'Bens de capital na frota: créditos de IBS/CBS na aquisição de caminhões, implementos e veículos', 2, '2026-09-14 00:00:00-03'),
  ('credito-presumido-do-tac-pessoa-fisica-calculo-aproveitamento-e-cst-especifico', 'Crédito presumido do TAC pessoa física: cálculo, aproveitamento e CST específico', 3, '2026-09-14 00:00:00-03'),
  ('tac-mei-vs-tac-pessoa-fisica-regimes-distintos-credito-presumido-e-aliquota-zero-art-110-lc-214-2025', 'TAC MEI vs. TAC pessoa física: regimes distintos, crédito presumido e alíquota zero (art. 110 LC 214/2025)', 4, '2026-09-14 00:00:00-03'),
  ('fornecedor-optante-pelo-simples-nacional-antes-do-inicio-da-transicao-regras-aplicaveis', 'Fornecedor optante pelo Simples Nacional antes do início da transição: regras aplicáveis', 5, '2026-09-21 00:00:00-03'),
  ('fornecedor-optante-pelo-simples-nacional-no-periodo-de-transicao-mudancas-e-impactos', 'Fornecedor optante pelo Simples Nacional no período de transição: mudanças e impactos', 6, '2026-09-21 00:00:00-03'),
  ('credito-de-cooperativas-de-transporte-hipoteses-ato-cooperativo-e-limitacoes', 'Crédito de cooperativas de transporte: hipóteses, ato cooperativo e limitações', 7, '2026-09-21 00:00:00-03'),
  ('a-transportadora-optante-pelo-simples-nacional-regime-especifico-restricoes-e-oportunidades', 'A transportadora optante pelo Simples Nacional: regime específico, restrições e oportunidades', 8, '2026-09-21 00:00:00-03'),
  ('regimes-diferenciados-previstos-na-lc-214-2025-o-que-se-aplica-ao-setor-de-transporte', 'Regimes diferenciados previstos na LC 214/2025: o que se aplica ao setor de transporte', 9, '2026-09-28 00:00:00-03'),
  ('acumulo-de-creditos-causas-estruturais-gestao-durante-a-transicao-e-pedido-de-ressarcimento', 'Acúmulo de créditos: causas estruturais, gestão durante a transição e pedido de ressarcimento', 10, '2026-09-28 00:00:00-03'),
  ('casos-praticos-planejamento-de-creditos-em-operacoes-de-transporte', 'Casos práticos: planejamento de créditos em operações de transporte', 11, '2026-09-28 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set title = excluded.title, position = excluded.position, release_at = excluded.release_at;

-- =========================
-- Aulas — Módulo 5 (9 aulas — libera 05/out e 13/out, terça por feriado 12/out)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'icms-transicao'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('a-coexistencia-dos-dois-sistemas-como-icms-e-ibs-cbs-convivem-de-2026-a-2033', 'A coexistência dos dois sistemas: como ICMS e IBS/CBS convivem de 2026 a 2033', 1, '2026-10-05 00:00:00-03'),
  ('a-reducao-gradual-das-aliquotas-de-icms-cronograma-impactos-e-planejamento', 'A redução gradual das alíquotas de ICMS: cronograma, impactos e planejamento', 2, '2026-10-05 00:00:00-03'),
  ('icms-com-beneficio-fiscal-x-ibs-sem-equivalente-o-problema-central-da-transicao', 'ICMS com benefício fiscal x IBS sem equivalente: o problema central da transição', 3, '2026-10-05 00:00:00-03'),
  ('gestao-do-credito-acumulado-de-icms-habilitacao-2026-2028-ressarcimento-em-20-anos-e-correcao-pelo-ipca', 'Gestão do crédito acumulado de ICMS: habilitação (2026–2028), ressarcimento em 20 anos e correção pelo IPCA', 4, '2026-10-05 00:00:00-03'),
  ('difal-na-transicao-o-que-muda-para-a-transportadora-destinataria-de-mercadorias', 'DIFAL na transição: o que muda para a transportadora destinatária de mercadorias', 5, '2026-10-05 00:00:00-03'),
  ('o-simples-nacional-e-o-icms-durante-a-transicao-pontos-de-atencao', 'O Simples Nacional e o ICMS durante a transição: pontos de atenção', 6, '2026-10-13 00:00:00-03'),
  ('a-extincao-do-icms-em-2033-como-se-preparar-desde-ja', 'A extinção do ICMS em 2033: como se preparar desde já', 7, '2026-10-13 00:00:00-03'),
  ('icms-na-base-do-ibs-cbs-o-conflito-tributario-de-2027-a-posicao-dos-estados-e-o-risco-de-autuacao', 'ICMS na base do IBS/CBS: o conflito tributário de 2027, a posição dos estados e o risco de autuação', 8, '2026-10-13 00:00:00-03'),
  ('mato-grosso-e-o-centro-oeste-na-transicao-beneficios-de-icms-credito-outorgado-do-trc-e-estrategia-regional', 'Mato Grosso e o Centro-Oeste na transição: benefícios de ICMS, crédito outorgado do TRC e estratégia regional', 9, '2026-10-13 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set title = excluded.title, position = excluded.position, release_at = excluded.release_at;

-- =========================
-- Aulas — Módulo 6 (8 aulas + 2 oficinas — libera 19/out e 26/out)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'obrigacoes-acessorias'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('documentos-fiscais-que-permanecem-e-suas-adaptacoes-ao-novo-sistema-tributario', 'Documentos fiscais que permanecem e suas adaptações ao novo sistema tributário', 1, '2026-10-19 00:00:00-03'),
  ('o-ct-e-apos-o-sinief-24-2024-novos-campos-grupo-ibscbs-cst-cclasstrib-e-regras-de-validacao', 'O CT-e após o SINIEF 24/2024: novos campos, grupo IBSCBS, CST, CClassTrib e regras de validação', 2, '2026-10-19 00:00:00-03'),
  ('ct-e-os-hipoteses-de-uso-preenchimento-e-diferencas-em-relacao-ao-ct-e-padrao', 'CT-e OS: hipóteses de uso, preenchimento e diferenças em relação ao CT-e padrão', 3, '2026-10-19 00:00:00-03'),
  ('mdf-e-e-gtv-e-atualizacao-integracao-e-pontos-de-atencao-operacional', 'MDF-e e GTV-e: atualização, integração e pontos de atenção operacional', 4, '2026-10-19 00:00:00-03'),
  ('efd-na-transicao-ajustes-na-escrituracao-fiscal-digital-durante-a-coexistencia-dos-sistemas', 'EFD na transição: ajustes na escrituração fiscal digital durante a coexistência dos sistemas', 5, '2026-10-26 00:00:00-03'),
  ('efd-contribuicoes-extincao-em-2027-o-que-substitui-e-providencias-para-a-transportadora', 'EFD-Contribuições: extinção em 2027, o que substitui e providências para a transportadora', 6, '2026-10-26 00:00:00-03'),
  ('2026-como-ano-de-apuracao-sem-recolhimento-oportunidades-riscos-e-providencias-imediatas', '2026 como ano de apuração sem recolhimento: oportunidades, riscos e providências imediatas', 7, '2026-10-26 00:00:00-03'),
  ('governanca-fiscal-na-transportadora-organizacao-interna-para-enfrentar-a-transicao', 'Governança fiscal na transportadora: organização interna para enfrentar a transição', 8, '2026-10-26 00:00:00-03'),
  ('oficina-1', 'Oficina 1 — Preenchimento do CT-e: casos principais (subcontratação, redespacho, exportação)', 9, '2026-10-26 00:00:00-03'),
  ('oficina-2', 'Oficina 2 — CT-e OS e cenários de subcontratação: campo a campo em casos reais', 10, '2026-10-26 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set title = excluded.title, position = excluded.position, release_at = excluded.release_at;

-- =========================
-- Aulas — Módulo 7 (5 aulas — libera 02/nov)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'estrategia'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('comparacao-de-regimes-tributarios-para-transportadoras-lucro-real-presumido-e-simples-o-que-determina-a-escolha-na-transicao', 'Comparação de regimes tributários para transportadoras: Lucro Real, Presumido e Simples — o que determina a escolha na transição', 1, '2026-11-02 00:00:00-03'),
  ('o-simples-hibrido-a-decisao-critica-de-setembro-2026-e-seus-efeitos-em-2027-simulacao-e-criterios', 'O Simples Híbrido: a decisão crítica de setembro/2026 e seus efeitos em 2027 — simulação e critérios', 2, '2026-11-02 00:00:00-03'),
  ('o-impacto-da-reforma-no-preco-do-frete-calculo-do-aumento-de-carga-tributaria-repasse-contratual-e-renegociacao', 'O impacto da reforma no preço do frete: cálculo do aumento de carga tributária, repasse contratual e renegociação', 3, '2026-11-02 00:00:00-03'),
  ('split-payment-em-2027-impacto-estrutural-no-capital-de-giro-e-preparacao-financeira-desde-2026', 'Split payment em 2027: impacto estrutural no capital de giro e preparação financeira desde 2026', 4, '2026-11-02 00:00:00-03'),
  ('riscos-juridicos-da-transicao-e-documentacao-preventiva-como-construir-uma-posicao-defensavel-antes-da-autuacao', 'Riscos jurídicos da transição e documentação preventiva: como construir uma posição defensável antes da autuação', 5, '2026-11-02 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set title = excluded.title, position = excluded.position, release_at = excluded.release_at;

-- =========================
-- Sessões ao vivo — 7 tira-dúvidas (19:30 BRT, sempre quinta)
-- =========================
with ctx as (
  select id as course_id from public.courses where slug = 'reforma-tributaria-transporte'
)
insert into public.live_sessions (course_id, module_id, slug, title, starts_at, duration_minutes, position)
select
  ctx.course_id,
  (select m.id from public.modules m where m.course_id = ctx.course_id and m.slug = ls.module_slug),
  ls.slug, ls.title, ls.starts_at::timestamptz, 90, ls.position
from ctx, (values
  ('tira-duvidas-modulo-1',     'tributacao-do-consumo',  'Tira-dúvidas — A Nova Tributação do Consumo',     '2026-08-13 19:30:00-03', 1),
  ('tira-duvidas-modulo-2',     'cargas',                 'Tira-dúvidas — IBS/CBS no Transporte de Cargas',  '2026-09-03 19:30:00-03', 2),
  ('tira-duvidas-modulo-3',     'passageiros',            'Tira-dúvidas — Transporte de Passageiros',        '2026-09-10 19:30:00-03', 3),
  ('tira-duvidas-modulo-4',     'creditos',               'Tira-dúvidas — Gestão de Créditos',               '2026-10-01 19:30:00-03', 4),
  ('tira-duvidas-modulo-5',     'icms-transicao',         'Tira-dúvidas — ICMS na Transição',                '2026-10-15 19:30:00-03', 5),
  ('tira-duvidas-modulo-6',     'obrigacoes-acessorias',  'Tira-dúvidas — Obrigações Acessórias',            '2026-10-29 19:30:00-03', 6),
  ('tira-duvidas-encerramento', 'estrategia',             'Tira-dúvidas Final + Encerramento',               '2026-11-05 19:30:00-03', 7)
) as ls(slug, module_slug, title, starts_at, position)
on conflict (course_id, slug) do update
  set starts_at = excluded.starts_at, title = excluded.title,
      position = excluded.position, module_id = excluded.module_id;
