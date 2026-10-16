"""Migra src/data/content.json para os 34 produtos do catálogo V3 (fonte autoritativa)."""
import json
C='src/data/content.json'; V='src/data/catalogo-produtos-imunoscan-v3.json'
c=json.load(open(C,encoding='utf-8')); v=json.load(open(V,encoding='utf-8'))['products']
old={p['id']:p for p in c['products']}
# Reuso apenas de correspondências 1:1 inequívocas (texto técnico genérico; sem SKU/apresentação/registro)
REUSE={'invitroclone-anti-d-rh1':'PROD-INVITROCLONE-ANTI-D','invitroclone-anti-cde':'PROD-INVITROCLONE-ANTI-CDE',
'invitroclone-anti-cw-rh8':'PROD-INVITROCLONE-ANTI-CW','invitroclone-rh-hr-control':'PROD-INVITROCLONE-RH-HR-CONTROL',
'invitroclone-anti-k-kel1':'PROD-INVITROCLONE-ANTI-K','invitroliq-anti-k-kel2':'PROD-INVITROLIQ-ANTI-K',
'invitroclone-agh-serum':'PROD-INVITROCLONE-AGH','invitrocyte-coombs-control':'PROD-INVITROCYTE-COOMBS-CONTROL',
'imunoscan-liss':'PROD-IMUNOSCAN-LISS','imunoscan-peg':'PROD-IMUNOSCAN-PEG'}
H='Diagnóstico & Imuno-hematologia'
CAT={'ABO':f'{H} > Tipagem Sanguínea > Sistema ABO','RH':f'{H} > Tipagem Sanguínea > Sistema Rh',
'OUT':f'{H} > Tipagem Sanguínea > Outros Sistemas','AGH':f'{H} > Antiglobulina Humana',
'REV':f'{H} > Hemácias-Teste > Prova Reversa ABO','PAI':f'{H} > Hemácias-Teste > Triagem e Identificação',
'CTL':f'{H} > Controles','POT':f'{H} > Potencializadores e Soluções'}
def cat(s):
  if s in('invitroclone-anti-a','invitroclone-anti-b','invitroclone-anti-ab'):return 'ABO'
  if s=='invitroclone-rh-hr-control' or 'coombs' in s or s=='imunoscan-cqi':return 'CTL'
  if any(k in s for k in('rh','cde')):return 'RH'
  if any(k in s for k in('kel','jk','mns','fy')):return 'OUT'
  if 'agh' in s or 'igg' in s:return 'AGH'
  if 'reverse' in s:return 'REV'
  if 'scan-i-ii' in s or 'ident' in s:return 'PAI'
  return 'POT'
PEND='Informações técnicas detalhadas em atualização pela ImunoScan'
new=[];pages_map={}
for p in v:
  k=cat(p['slug']);o=old.get(REUSE.get(p['slug'],''))
  td={'sku':p['technical_data']['sku'],'presentation':p['technical_data']['presentation']}
  pending=['anvisa','documents']
  if o:
    pc={'short_description':o['public_content']['short_description'],'description':o['public_content']['description'],'applications':o['public_content'].get('applications',[])}
    for f in('concentration','methodology','storage'):
      if o['technical_data'].get(f):td[f]=o['technical_data'][f]
      else:pending.append(f)
    src=['CATALOGO-V3']+o.get('source_ids',[])
  else:
    pc={'short_description':PEND,'description':PEND,'applications':[]}
    pending+=['short_description','description','applications','concentration','methodology','storage']
    src=['CATALOGO-V3']
  new.append({'id':p['id'],'slug':p['slug'],'name':p['name'],'family':p['family'],'category':CAT[k],
    'public_content':pc,'technical_data':td,'media':p['media'],'documents':[],
    'confidence':'confirmed' if o else 'pending','source_ids':src,'pending_fields':pending,
    'evidence_status':'catálogo ImunoScan V3' + (' + texto técnico genérico reaproveitado' if o else ''),
    'current_commercial_status':'portfólio ativo (catálogo V3)'})
  pages_map.setdefault(k,[]).append(p['id'])
PG={'PAGE-SUBCAT-ABO':['ABO'],'PAGE-SUBCAT-RH':['RH'],'PAGE-SUBCAT-OUTROS-SISTEMAS':['OUT'],
'PAGE-CAT-HEMACIAS':['REV','PAI'],'PAGE-SUBCAT-REVERSA':['REV'],'PAGE-SUBCAT-PAI-IAI':['PAI'],
'PAGE-CAT-AGH':['AGH'],'PAGE-CAT-POTENCIALIZADORES':['POT'],'PAGE-CAT-CONTROLES':['CTL']}
for pg in c['pages']:
  if pg['id'] in PG: pg['products']=[i for k in PG[pg['id']] for i in pages_map.get(k,[])]
  elif pg['products']: pg['products']=[]
# Rh-hr Control também aparece em Sistema Rh; Coombs Control também em Hemácias-Teste
for pg in c['pages']:
  if pg['id']=='PAGE-SUBCAT-RH':pg['products'].append('PROD-INVITROCLONE_RH_HR_CONTROL')
  if pg['id']=='PAGE-CAT-HEMACIAS':pg['products'].append('PROD-INVITROCYTE_COOMBS_CONTROL')
c['products']=new
json.dump(c,open(C,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print('ok',len(new),sum(1 for n in new if n['confidence']=='confirmed'))
