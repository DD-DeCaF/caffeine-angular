import { TestBed, inject } from '@angular/core/testing';

import { BiggSearchService } from './bigg-search.service';
import {AppMaterialModule} from '../../../../../../app-material.module';
import {BiggSearch} from '../../../../../types';
import {HttpClientModule} from '@angular/common/http';

describe('BiggSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        HttpClientModule,
      ],
      providers: [BiggSearchService],
    });
  });

  it('should be created', inject([BiggSearchService], (service: BiggSearchService) => {
    expect(service).toBeTruthy();
  }));

  it('should return results equal to a constant', inject([BiggSearchService], (service: BiggSearchService) => {
    const results = [
      {
        'name': 'ATPase  cytosolic',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS',
        'organism': '',
      },
      {
        'name': 'ATP maintenance requirement',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPM',
        'organism': '',
      },
      {
        'name': 'ADPATP transporter  peroxisomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPtp_H',
        'organism': '',
      },
      {
        'name': 'EX atp LPAREN e RPAREN ',
        'model_bigg_id': 'Universal',
        'bigg_id': 'EX_atp_e',
        'organism': '',
      },
      {
        'name': 'AMPATP transporter  peroxisomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATP2tp_H',
        'organism': '',
      },
      {
        'name': 'DM atp c',
        'model_bigg_id': 'Universal',
        'bigg_id': 'DM_atp_c',
        'organism': '',
      },
      {
        'name': 'ADP/ATP Transporter, Golgi',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPtg',
        'organism': '',
      },
      {
        'name': 'ADP/ATP transporter, mitochondrial',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPtm',
        'organism': '',
      },
      {
        'name': 'ATP diffusion in nucleus',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPtn',
        'organism': '',
      },
      {
        'name': 'ATP amine hydrolysis (spontaneous)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPHs',
        'organism': '',
      },
      {
        'name': 'ATP diphosphohydrolase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPH1',
        'organism': '',
      },
      {
        'name': 'ATP synthase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPSh',
        'organism': '',
      },
      {
        'name': 'H+-exporting ATPase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS1',
        'organism': '',
      },
      {
        'name': 'ATP synthetase(u)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPSu',
        'organism': '',
      },
      {
        'name': 'ATP transporter, peroxisomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPtx',
        'organism': '',
      },
      {
        'name': 'ADP/ATP transporter, mitochondrial',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATP_3h_tm',
        'organism': '',
      },
      {
        'name': 'ADP/ATP transporter, chloroplast',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATP_3h_th',
        'organism': '',
      },
      {
        'name': 'ATP phosphoribosyltransferase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPPRT',
        'organism': '',
      },
      {
        'name': 'ATP synthase (four protons for one ATP)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS4m',
        'organism': '',
      },
      {
        'name': 'ATP synthase (thylakoid membrane)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPSum',
        'organism': '',
      },
      {
        'name': 'ATP synthase three protons for one ATP ',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS3r',
        'organism': '',
      },
      {
        'name': 'ATP diphosphohydrolase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPH1e',
        'organism': '',
      },
      {
        'name': 'ATP synthase (four protons for one ATP)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS4r',
        'organism': '',
      },
      {
        'name': 'ATP phosphohydrolase, mitochondria',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPPHm',
        'organism': '',
      },
      {
        'name': 'ATP diphosphohydrolase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPH2e',
        'organism': '',
      },
      {
        'name': 'ATP synthase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS_h',
        'organism': '',
      },
      {
        'name': 'Non-growth associated ATP maintenance',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPM_h',
        'organism': '',
      },
      {
        'name': 'ADP/ATP antiport, chloroplast',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPt_h',
        'organism': '',
      },
      {
        'name': 'ADP/ATP antiport, mitochondria step 1',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPt_m',
        'organism': '',
      },
      {
        'name': 'ATP synthase  mitochondrial',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS3m',
        'organism': '',
      },
      {
        'name': 'ATP synthase  Golgi Apparatus',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS3g',
        'organism': '',
      },
      {
        'name': 'ATP synthase  vacuole',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS3v',
        'organism': '',
      },
      {
        'name': 'ATP adenylyltransferase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPATF1',
        'organism': '',
      },
      {
        'name': 'ATP adenylyltransferase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPATF2',
        'organism': '',
      },
      {
        'name': 'ATP adenylyltransferase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPATF3',
        'organism': '',
      },
      {
        'name': 'ADPATP transporter  mitochondrial',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPtm_H',
        'organism': '',
      },
      {
        'name': 'ADP/ATP transporter, endoplasmic reticulum',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATP1ter',
        'organism': '',
      },
      {
        'name': 'AMP/ATP transporter, endoplasmic reticulum',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATP2ter',
        'organism': '',
      },
      {
        'name': 'H4MPTGL  atp ',
        'model_bigg_id': 'Universal',
        'bigg_id': 'H4MPTGL_atp',
        'organism': '',
      },
      {
        'name': 'Allantoin synthetase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATS',
        'organism': '',
      },
      {
        'name': 'V-type ATPase, H+ transporting, lysosomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPasel',
        'organism': '',
      },
      {
        'name': 'ADP/ATP antiport, mitochondria, step 2',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATP2t_m',
        'organism': '',
      },
      {
        'name': 'ATP synthase (four protons for one ATP)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS4mi',
        'organism': '',
      },
      {
        'name': 'ATP synthase (four protons for one ATP) (periplasm)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS4rpp',
        'organism': '',
      },
      {
        'name': 'ATP synthase (10 protons for three ATP)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS10_3',
        'organism': '',
      },
      {
        'name': 'ATGH',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATGH',
        'organism': '',
      },
      {
        'name': 'ATSH',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATSH',
        'organism': '',
      },
      {
        'name': 'Anthrnailate synthase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATNS',
        'organism': '',
      },
      {
        'name': 'Allantoate amidinohydrolase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATAH',
        'organism': '',
      },
      {
        'name': 'KATp',
        'model_bigg_id': 'Universal',
        'bigg_id': 'KATp',
        'organism': '',
      },
      {
        'name': 'Catalase A  peroxisomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'CATp',
        'organism': '',
      },
      {
        'name': 'Acetate transport  peroxisomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ACtp',
        'organism': '',
      },
      {
        'name': 'ATIH',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATIH',
        'organism': '',
      },
      {
        'name': 'V-Type ATPase, H+ Transporting, Lysosomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPasel_1',
        'organism': '',
      },
      {
        'name': 'ATP synthase (10 protons for 3 ATP) (periplasm)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS10rpp',
        'organism': '',
      },
      {
        'name': 'ATP:1D-myo-inositol-1,4,5-trisphosphate 6-phosphotransferase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'AMITP',
        'organism': '',
      },
      {
        'name': 'AKG transporter  peroxisome',
        'model_bigg_id': 'Universal',
        'bigg_id': 'AKGtp',
        'organism': '',
      },
      {
        'name': 'Oxalate transport out of peroxisome',
        'model_bigg_id': 'Universal',
        'bigg_id': 'OXAtp',
        'organism': '',
      },
      {
        'name': 'Coenzyme A transport, peroxisomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'COAtp',
        'organism': '',
      },
      {
        'name': 'ATP synthase (four protons for one ATP) (periplasm)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS4rpp_1',
        'organism': '',
      },
      {
        'name': 'AMP transporter, peroxisome',
        'model_bigg_id': 'Universal',
        'bigg_id': 'AMPtp',
        'organism': '',
      },
      {
        'name': 'ATP:AMP phosphotransferase, chloroplast',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATAMh',
        'organism': '',
      },
      {
        'name': 'ATP:GDP phosphotransferase, mitochondria',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATGDm',
        'organism': '',
      },
      {
        'name': 'ATP synthase (four protons for one ATP)',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATPS4m_cho',
        'organism': '',
      },
      {
        'name': '(S)(+)-allantoin amidohydrolase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATNAH',
        'organism': '',
      },
      {
        'name': 'Orotic acid transport inout via proton symporter',
        'model_bigg_id': 'Universal',
        'bigg_id': 'OROATP',
        'organism': '',
      },
      {
        'name': 'ATP:dAMP phosphotransferase, chloroplast',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATDAMh',
        'organism': '',
      },
      {
        'name': 'ATP:dAMP phosphotransferase, mitochondria',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATDAMm',
        'organism': '',
      },
      {
        'name': 'ATP:dGDP phosphotransferase, mitochondria',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATDGDm',
        'organism': '',
      },
      {
        'name': 'ATRZCH',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATRZCH',
        'organism': '',
      },
      {
        'name': 'Carnitine O acetyltransferase  reverse direction  peroxisomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'CSNATp',
        'organism': '',
      },
      {
        'name': 'L-alanine export via facilited diffusion',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ALAtpp',
        'organism': '',
      },
      {
        'name': 'Acetylcarnitine transport out of peroxisome',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ACRNtp',
        'organism': '',
      },
      {
        'name': 'L-allo-threonine dehydrogenase',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATHRDHr',
        'organism': '',
      },
      {
        'name': 'Chondroitin sulfate A transport, golgi to extracellular',
        'model_bigg_id': 'Universal',
        'bigg_id': 'CSPG_At',
        'organism': '',
      },
      {
        'name': 'Uptake of atorvastatin by enterocytes',
        'model_bigg_id': 'Universal',
        'bigg_id': 'ATVACIDOATPtu',
        'organism': '',
      },
      {
        'name': 'L erythro 4 Hydroxyglutamate2 oxoglutarate aminotransferase  peroxisomal',
        'model_bigg_id': 'Universal',
        'bigg_id': 'EHGLATp',
        'organism': '',
      },
    ];
    service.search('ATP').subscribe((data: BiggSearch) => {
      expect(data.results).toEqual(results);
    });
  }));

  it('should be an empty array', inject([BiggSearchService], (service: BiggSearchService) => {
    const results = [];
    service.search('xxxxx').subscribe((data: BiggSearch) => {
      expect(data.results).toEqual(results);
    });
  }));
});
