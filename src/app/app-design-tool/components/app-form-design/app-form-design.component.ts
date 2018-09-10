// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatButton} from '@angular/material';
import * as types from '../../../app-interactive-map/types';
import {Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {NgForm} from '@angular/forms';
import {FetchModelsDesign, FetchSpeciesDesign, StartDesign} from '../../store/design-tool.actions';
import {activeModels} from '../../store/design-tool.selectors';
import * as typesDesign from '../../types';


@Component({
  selector: 'app-form-design',
  templateUrl: './app-form-design.component.html',
  styleUrls: ['./app-form-design.component.scss'],
})
export class AppFormDesignComponent implements OnInit, AfterViewInit {
  @ViewChild('designForm') designForm: NgForm;
  subscription: Subscription;
  @ViewChild('design') designButton: MatButton;

  @Input() sidenav: boolean;

  public selectedSpecies: Observable<types.Species>;
  public allSpecies: Observable<types.Species[]>;
  public options: typesDesign.Product[] = [ {'name': 'menaquinol-10', 'id': 'menaquinol-10'}, {
    'name': '2,6,10,14-tetramethylpentadecanal',
    'id': '2,6,10,14-tetramethylpentadecanal',
  }, {
    'name': 'alpha-N-acetylneuraminyl-(2->3)-beta-D-galactosyl-(1->3)-N-acetyl-alpha-D-galactosaminyl group',
    'id': 'alpha-N-acetylneuraminyl-(2->3)-beta-D-galactosyl-(1->3)-N-acetyl-alpha-D-galactosaminyl group',
  }, {'name': '3-oxododecanoyl-CoA', 'id': '3-oxododecanoyl-CoA'}, {'name': 'L-2-aminoadipate', 'id': 'L-2-aminoadipate'}, {
    'name': '6-decylubiquinol',
    'id': '6-decylubiquinol',
  }, {'name': 'phosphoramidate', 'id': 'phosphoramidate'}, {'name': 'propene', 'id': 'propene'}, {
    'name': '3\'-(L-glutamate)adenylyl group',
    'id': '3\'-(L-glutamate)adenylyl group',
  }, {
    'name': '(9Z,13S,15Z)-12,13-epoxyoctadeca-9,11,15-trienoate',
    'id': '(9Z,13S,15Z)-12,13-epoxyoctadeca-9,11,15-trienoate',
  }, {'name': 'dTDP-3-dehydro-6-deoxy-alpha-D-glucose', 'id': 'dTDP-3-dehydro-6-deoxy-alpha-D-glucose'}, {
    'name': '3-acetamidopropanal',
    'id': '3-acetamidopropanal',
  }, {'name': '(R,R)-chrysanthemyl diphosphate', 'id': '(R,R)-chrysanthemyl diphosphate'}, {
    'name': '3-hydroxy-2-methyl-1H-quinolin-4-one',
    'id': '3-hydroxy-2-methyl-1H-quinolin-4-one',
  }, {'name': 'hesperidin', 'id': 'hesperidin'}, {'name': 'loliose', 'id': 'loliose'}, {
    'name': 'beta-D-fructose 2,6-bisphosphate',
    'id': 'beta-D-fructose 2,6-bisphosphate',
  }, {'name': 'beta-D-glucose 1-phosphate', 'id': 'beta-D-glucose 1-phosphate'}, {
    'name': 'O-ureido-D-serine',
    'id': 'O-ureido-D-serine',
  }, {'name': '2-methylpropanal O-methyloxime', 'id': '2-methylpropanal O-methyloxime'}, {
    'name': 'selenate',
    'id': 'selenate',
  }, {'name': '(11Z,14Z,17Z,20Z)-hexacosatetraenoyl-CoA', 'id': '(11Z,14Z,17Z,20Z)-hexacosatetraenoyl-CoA'}, {
    'name': 'N-(dodecanoyl)-sphinganine',
    'id': 'N-(dodecanoyl)-sphinganine',
  }, {'name': '2-hydroxybenzoyl-CoA', 'id': '2-hydroxybenzoyl-CoA'}, {
    'name': '2\'-deamino-2\'-hydroxyparomamine',
    'id': '2\'-deamino-2\'-hydroxyparomamine',
  }, {
    'name': '3\'-(L-glutaminyl)adenylyl group',
    'id': '3\'-(L-glutaminyl)adenylyl group',
  }, {
    'name': 'beta-D-Gal-(1->3)-beta-D-GlcNAc-(1->3)-beta-D-Gal-(1->4)-D-Glc',
    'id': 'beta-D-Gal-(1->3)-beta-D-GlcNAc-(1->3)-beta-D-Gal-(1->4)-D-Glc',
  }, {
    'name': '5,6-dihydroxy-3-methyl-2-oxo-1,2-dihydroquinoline',
    'id': '5,6-dihydroxy-3-methyl-2-oxo-1,2-dihydroquinoline',
  }, {'name': '4-O-beta-D-mannopyranosyl-N-acetyl-D-glucosamine', 'id': '4-O-beta-D-mannopyranosyl-N-acetyl-D-glucosamine'}, {
    'name': '(+)-copalol',
    'id': '(+)-copalol',
  }, {'name': '1D-3-O-methyl-myo-inositol', 'id': '1D-3-O-methyl-myo-inositol'}, {
    'name': '(9Z,11E,13Z)-octadecatrienoyl group',
    'id': '(9Z,11E,13Z)-octadecatrienoyl group',
  }, {'name': '3-O-sulfo-beta-D-galactosyl-diacylglycerol', 'id': '3-O-sulfo-beta-D-galactosyl-diacylglycerol'}, {
    'name': 'demethylmacrocin',
    'id': 'demethylmacrocin',
  }, {
    'name': '2-N,3-O-bis(3-hydroxytetradecanoyl)-alpha-D-glucosaminyl 1-phosphate',
    'id': '2-N,3-O-bis(3-hydroxytetradecanoyl)-alpha-D-glucosaminyl 1-phosphate',
  }, {'name': 'N(6)-acetyl-L-lysine residue', 'id': 'N(6)-acetyl-L-lysine residue'}, {
    'name': 'O-methyl anthranilate',
    'id': 'O-methyl anthranilate',
  }, {'name': 'quinine', 'id': 'quinine'}, {'name': 'mycoclysin', 'id': 'mycoclysin'}, {
    'name': '5-deoxy-alpha-D-ribose 1-phosphate',
    'id': '5-deoxy-alpha-D-ribose 1-phosphate',
  }, {'name': 'N(7)-methylguanosine 5\'-diphosphate', 'id': 'N(7)-methylguanosine 5\'-diphosphate'}, {
    'name': 'L-seryl-AMP',
    'id': 'L-seryl-AMP',
  }, {'name': 'precorrin-6B', 'id': 'precorrin-6B'}, {'name': 'spheroiden-2-one', 'id': 'spheroiden-2-one'}, {
    'name': 'N-acyl-beta-D-galactosyl-sphing-4-enine',
    'id': 'N-acyl-beta-D-galactosyl-sphing-4-enine',
  }, {
    'name': '2-amino-6-acetyl-3,7,8,9-tetrahydro-3H-pyrimido[4,5-b][1,4]diazepin-4-one',
    'id': '2-amino-6-acetyl-3,7,8,9-tetrahydro-3H-pyrimido[4,5-b][1,4]diazepin-4-one',
  }, {
    'name': '3-oxo-(21Z,24Z,27Z,30Z)-hexatriacontatetraenoyl-CoA',
    'id': '3-oxo-(21Z,24Z,27Z,30Z)-hexatriacontatetraenoyl-CoA',
  }, {'name': '5alpha-cholesta-7,24-dien-3beta-ol', 'id': '5alpha-cholesta-7,24-dien-3beta-ol'}, {
    'name': 'glutathione amide disulfide',
    'id': 'glutathione amide disulfide',
  }, {'name': 'phytosphingosine 1-phosphate', 'id': 'phytosphingosine 1-phosphate'}, {
    'name': 'N(6)-L-threonylcarbamoyladenosine 5\'-phosphate residue',
    'id': 'N(6)-L-threonylcarbamoyladenosine 5\'-phosphate residue',
  }, {'name': 'beta-D-galactose', 'id': 'beta-D-galactose'}, {
    'name': 'phenanthrene-3,4-diol',
    'id': 'phenanthrene-3,4-diol',
  }, {
    'name': '6-carboxy-5,6,7,8-tetrahydropterin',
    'id': '6-carboxy-5,6,7,8-tetrahydropterin',
  }, {
    'name': '(1S,4E,8E,12E)-2,2,5,9,13-pentamethylcyclopentadeca-4,8,12-trien-1-ol',
    'id': '(1S,4E,8E,12E)-2,2,5,9,13-pentamethylcyclopentadeca-4,8,12-trien-1-ol',
  }, {'name': '(11Z,14Z)-icosadienoyl group', 'id': '(11Z,14Z)-icosadienoyl group'}, {
    'name': 'S-methyl-5\'-thioadenosine',
    'id': 'S-methyl-5\'-thioadenosine',
  }, {'name': '2-hydroxy-3-methylhexadecanoyl-CoA', 'id': '2-hydroxy-3-methylhexadecanoyl-CoA'}, {
    'name': 'cob(I)yrinate a,c-diamide',
    'id': 'cob(I)yrinate a,c-diamide',
  }, {'name': '8-oxoguanine', 'id': '8-oxoguanine'}, {
    'name': 'galactitol 1-phosphate',
    'id': 'galactitol 1-phosphate',
  }, {'name': '(1S)-1,23,25-trihydroxy-24-oxocalciol', 'id': '(1S)-1,23,25-trihydroxy-24-oxocalciol'}, {
    'name': '(2R,3R)-tartrate',
    'id': '(2R,3R)-tartrate',
  }, {'name': '5-hydroxypseudobaptigenin', 'id': '5-hydroxypseudobaptigenin'}, {
    'name': 'S-carboxymethyl-L-cysteine',
    'id': 'S-carboxymethyl-L-cysteine',
  }, {'name': '5,10-dihydrophenazine 1-carboxylate', 'id': '5,10-dihydrophenazine 1-carboxylate'}, {
    'name': '4-O-feruloyl-D-quinate',
    'id': '4-O-feruloyl-D-quinate',
  }, {'name': 'bromochloromethane', 'id': 'bromochloromethane'}, {
    'name': 'epoxyqueuosine 5\'-phosphate residue',
    'id': 'epoxyqueuosine 5\'-phosphate residue',
  }, {'name': 'oxidized dinoflagellate luciferin', 'id': 'oxidized dinoflagellate luciferin'}, {
    'name': 'fumigaclavine C',
    'id': 'fumigaclavine C',
  }, {'name': '(5Z,8Z,11Z,14Z)-eicosatetraenoyl-CoA', 'id': '(5Z,8Z,11Z,14Z)-eicosatetraenoyl-CoA'}, {
    'name': 'a N-[(2\'R)-(4R)-hydroxyacyl]sphinganine',
    'id': 'a N-[(2\'R)-(4R)-hydroxyacyl]sphinganine',
  }, {'name': '11,12-epoxy-(5Z,8Z,14Z)-eicosatrienoate', 'id': '11,12-epoxy-(5Z,8Z,14Z)-eicosatrienoate'}, {
    'name': 'biochanin A',
    'id': 'biochanin A',
  }, {'name': 'alpha-D-mannose 6-phosphate', 'id': 'alpha-D-mannose 6-phosphate'}, {
    'name': '3-oxocyclopentanecarbonitrile',
    'id': '3-oxocyclopentanecarbonitrile',
  }, {
    'name': '4-O-beta-D-glucosyl-trans-4-coumarate',
    'id': '4-O-beta-D-glucosyl-trans-4-coumarate',
  }, {
    'name': '2-[(3S)-amino-3-carboxypropyl]-L-histidine residue',
    'id': '2-[(3S)-amino-3-carboxypropyl]-L-histidine residue',
  }, {'name': '(1S,2R)-1-C-(indol-3-yl)glycerol 3-phosphate', 'id': '(1S,2R)-1-C-(indol-3-yl)glycerol 3-phosphate'}, {
    'name': 'hercynylcysteine sulfoxide',
    'id': 'hercynylcysteine sulfoxide',
  }, {'name': '(2E,23Z,26Z,29Z,32Z)-octatriacontapentaenoyl-CoA', 'id': '(2E,23Z,26Z,29Z,32Z)-octatriacontapentaenoyl-CoA'}, {
    'name': 'an anilide',
    'id': 'an anilide',
  }, {'name': 'O-(9Z)-octadecenoyl-(R)-carnitine', 'id': 'O-(9Z)-octadecenoyl-(R)-carnitine'}, {
    'name': 'N(omega)-phospho-L-arginine residue',
    'id': 'N(omega)-phospho-L-arginine residue',
  }, {'name': 'beta-cyclopiazonate', 'id': 'beta-cyclopiazonate'}, {
    'name': 'D-glucose 1,6-bisphosphate',
    'id': 'D-glucose 1,6-bisphosphate',
  }, {'name': '2-dehydro-D-gluconate', 'id': '2-dehydro-D-gluconate'}, {
    'name': '3\'-N-debenzoyl-2\'-deoxytaxol',
    'id': '3\'-N-debenzoyl-2\'-deoxytaxol',
  }, {'name': 'nicotinate-adenine dinucleotide phosphate', 'id': 'nicotinate-adenine dinucleotide phosphate'}, {
    'name': 'O-phospho-L-homoserine',
    'id': 'O-phospho-L-homoserine',
  }, {'name': '(9Z)-octadecenoate', 'id': '(9Z)-octadecenoate'}, {
    'name': '2-methylbutanoyl-CoA',
    'id': '2-methylbutanoyl-CoA',
  }, {'name': 'cis-3,4-leucopelargonidin', 'id': 'cis-3,4-leucopelargonidin'}, {
    'name': '5beta-pregnan-3,20-dione',
    'id': '5beta-pregnan-3,20-dione',
  }, {'name': 'FMN-L-threonine residue', 'id': 'FMN-L-threonine residue'}, {
    'name': '1-O-(1Z-alkenyl)-2-acyl-sn-glycero-3-phospho-L-serine',
    'id': '1-O-(1Z-alkenyl)-2-acyl-sn-glycero-3-phospho-L-serine',
  }, {'name': 'thromboxane A2', 'id': 'thromboxane A2'}, {
    'name': 'beta-D-galactosyl-(1->4)-beta-D-glucosyl-(11)-N-acylsphing-4-enine',
    'id': 'beta-D-galactosyl-(1->4)-beta-D-glucosyl-(11)-N-acylsphing-4-enine',
  }, {
    'name': '(5Z,8Z,10E,12S)-hydroperoxyeicosatrienoate',
    'id': '(5Z,8Z,10E,12S)-hydroperoxyeicosatrienoate',
  }, {'name': 'lipid A 4\'-(2-aminoethyl diphosphate)', 'id': 'lipid A 4\'-(2-aminoethyl diphosphate)'}, {
    'name': 'alpha-D-galactose',
    'id': 'alpha-D-galactose',
  }, {'name': '(R)-3-phenyllactate', 'id': '(R)-3-phenyllactate'}, {
    'name': 'D-sorbitol 6-phosphate',
    'id': 'D-sorbitol 6-phosphate',
  }, {'name': '2-aminobenzenesulfonate', 'id': '2-aminobenzenesulfonate'}, {
    'name': 'N-(aminomethyl)urea',
    'id': 'N-(aminomethyl)urea',
  }, {'name': 'geranoyl-CoA', 'id': 'geranoyl-CoA'}, {'name': 'N-feruloylglycine', 'id': 'N-feruloylglycine'}, {
    'name': '5-hydroxyimidazole-4-acetate',
    'id': '5-hydroxyimidazole-4-acetate',
  }, {'name': 'all-trans-retinyl 9Z-octadecenoate', 'id': 'all-trans-retinyl 9Z-octadecenoate'}, {
    'name': '3-oxo-23,24-bisnorchola-1,4-dien-22-oate',
    'id': '3-oxo-23,24-bisnorchola-1,4-dien-22-oate',
  }, {'name': '1-O-(alk-1-enyl)-sn-glycero-3-phosphoethanolamine', 'id': '1-O-(alk-1-enyl)-sn-glycero-3-phosphoethanolamine'}, {
    'name': 'D-proline',
    'id': 'D-proline',
  }, {
    'name': '(8E,10R,12Z)-10-hydroperoxyoctadeca-8,12-dienoate',
    'id': '(8E,10R,12Z)-10-hydroperoxyoctadeca-8,12-dienoate',
  }, {
    'name': '1,2-di-(9Z-octadecenoyl)-sn-glycero-3-phospho-N,N-dimethylethanolamine',
    'id': '1,2-di-(9Z-octadecenoyl)-sn-glycero-3-phospho-N,N-dimethylethanolamine',
  }, {'name': 'L-glyceraldehyde', 'id': 'L-glyceraldehyde'}, {
    'name': '3-oxo-(8Z,11Z,14Z,17Z,20Z,23Z)-hexacosahexaenoyl-CoA',
    'id': '3-oxo-(8Z,11Z,14Z,17Z,20Z,23Z)-hexacosahexaenoyl-CoA',
  }, {
    'name': 'ecgonone methyl ester',
    'id': 'ecgonone methyl ester',
  }, {
    'name': 'N-acetyl-beta-D-glucosaminyl-(1->2)-alpha-D-mannosyl-(1->6)-beta-D-mannosyl group',
    'id': 'N-acetyl-beta-D-glucosaminyl-(1->2)-alpha-D-mannosyl-(1->6)-beta-D-mannosyl group',
  }, {
    'name': '1-octadecanoyl-2-(9Z)-octadecenoyl-sn-glycero-3-phospho-1D-myo-inositol 4-phosphate',
    'id': '1-octadecanoyl-2-(9Z)-octadecenoyl-sn-glycero-3-phospho-1D-myo-inositol 4-phosphate',
  }, {'name': '(S)-1-phenylethanol', 'id': '(S)-1-phenylethanol'}, {'name': '1,2-dehydroreticuline', 'id': '1,2-dehydroreticuline'}, {
    'name': 'biotin amide',
    'id': 'biotin amide',
  }, {'name': '30-hydroxy-11-oxo-beta-amyrin', 'id': '30-hydroxy-11-oxo-beta-amyrin'}, {
    'name': '2-(2-methylthioethyl)malate',
    'id': '2-(2-methylthioethyl)malate',
  }, {'name': '(+)-neomenthol', 'id': '(+)-neomenthol'}, {
    'name': 'N-acyl-4-hydroxysphinganine-1-phosphoethanolamine',
    'id': 'N-acyl-4-hydroxysphinganine-1-phosphoethanolamine',
  }, {'name': '20-hydroxy-leukotriene B4', 'id': '20-hydroxy-leukotriene B4'}, {
    'name': '1,2-diacyl-sn-glycero-3-phospho-L-serine',
    'id': '1,2-diacyl-sn-glycero-3-phospho-L-serine',
  }, {'name': 'adenosine 3\',5\'-bisphosphate', 'id': 'adenosine 3\',5\'-bisphosphate'}, {
    'name': 'D-glycero-alpha-D-manno-heptose 1-phosphate',
    'id': 'D-glycero-alpha-D-manno-heptose 1-phosphate',
  }, {'name': 'albendazole', 'id': 'albendazole'}, {
    'name': '(4Z,7Z,10Z,13Z,16Z,19Z)-docosahexaenoyl-CoA',
    'id': '(4Z,7Z,10Z,13Z,16Z,19Z)-docosahexaenoyl-CoA',
  }, {
    'name': '5-(3,4-diacetoxybut-1-ynyl)-2,2\'-bithiophene',
    'id': '5-(3,4-diacetoxybut-1-ynyl)-2,2\'-bithiophene',
  }, {'name': '2-dehydro-3-deoxy-6-phospho-D-gluconate', 'id': '2-dehydro-3-deoxy-6-phospho-D-gluconate'}, {
    'name': 'N(7)-methylguanosine 5\'-phosphate',
    'id': 'N(7)-methylguanosine 5\'-phosphate',
  }, {'name': '(2E,9Z,12Z)-octadecatrienoyl-CoA', 'id': '(2E,9Z,12Z)-octadecatrienoyl-CoA'}, {
    'name': 'cis-2,3-dihydroxy-2,3-dihydro-p-cumate',
    'id': 'cis-2,3-dihydroxy-2,3-dihydro-p-cumate',
  }, {'name': '2,3-dihexadecanoyl-sn-glycerol', 'id': '2,3-dihexadecanoyl-sn-glycerol'}, {
    'name': 'cephalosporin C',
    'id': 'cephalosporin C',
  }, {'name': 'norsolorinic acid', 'id': 'norsolorinic acid'}, {'name': 'glycolate', 'id': 'glycolate'}, {
    'name': '(R)-(2,4-dichlorophenoxy)propanoate',
    'id': '(R)-(2,4-dichlorophenoxy)propanoate',
  }, {'name': '(2S)-sakuranetin', 'id': '(2S)-sakuranetin'}, {
    'name': 'cholesteryl (9Z,12Z-octadecadienoate)',
    'id': 'cholesteryl (9Z,12Z-octadecadienoate)',
  }, {'name': '(3E,7Z,10Z,13Z,16Z,19Z)-docosahexaenoyl-CoA', 'id': '(3E,7Z,10Z,13Z,16Z,19Z)-docosahexaenoyl-CoA'}, {
    'name': 'thiamine triphosphate',
    'id': 'thiamine triphosphate',
  }, {'name': '2,5-dioxopentanoate', 'id': '2,5-dioxopentanoate'}, {
    'name': '4alpha-methyl-5alpha-cholesta-8,24-dien-3beta-ol',
    'id': '4alpha-methyl-5alpha-cholesta-8,24-dien-3beta-ol',
  }, {
    'name': 'cis-2-chloro-4-carboxymethylenebut-2-en-1,4-olide',
    'id': 'cis-2-chloro-4-carboxymethylenebut-2-en-1,4-olide',
  }, {'name': 'dTDP-6-deoxy-alpha-D-allose', 'id': 'dTDP-6-deoxy-alpha-D-allose'}, {
    'name': '(3S)-hydroxyhexadecanoyl-CoA',
    'id': '(3S)-hydroxyhexadecanoyl-CoA',
  }, {'name': 'a CMP-N-acyl-beta-neuraminate', 'id': 'a CMP-N-acyl-beta-neuraminate'}, {
    'name': 'N-acetyl-L-leucine',
    'id': 'N-acetyl-L-leucine',
  }, {'name': '4-aminoimidazole', 'id': '4-aminoimidazole'}, {
    'name': '(S)-3-amino-2-methylpropanoate',
    'id': '(S)-3-amino-2-methylpropanoate',
  }, {'name': '1-O-alkyl-3-acyl-sn-glycerol', 'id': '1-O-alkyl-3-acyl-sn-glycerol'}, {
    'name': 'an N-acyl-D-mannosaminolactone',
    'id': 'an N-acyl-D-mannosaminolactone',
  }, {'name': 'demethylsulochrin', 'id': 'demethylsulochrin'}, {
    'name': 'ent-kaur-16-en-19-al',
    'id': 'ent-kaur-16-en-19-al',
  }, {'name': 'a long-chain (2E)-enoyl-CoA', 'id': 'a long-chain (2E)-enoyl-CoA'}, {
    'name': 'D-glucurono-6,2-lactone',
    'id': 'D-glucurono-6,2-lactone',
  }, {'name': '(2R)-ethylmalonyl-CoA', 'id': '(2R)-ethylmalonyl-CoA'}, {
    'name': 'dihydrosterigmatocystin',
    'id': 'dihydrosterigmatocystin',
  }, {'name': 'N-acetylindoxyl', 'id': 'N-acetylindoxyl'}, {
    'name': '1,2-di-(4Z,7Z,10Z,13Z,16Z,19Z-docosahexaenoyl)-sn-glycero-3-phosphate',
    'id': '1,2-di-(4Z,7Z,10Z,13Z,16Z,19Z-docosahexaenoyl)-sn-glycero-3-phosphate',
  }, {'name': 'a phosphate monoester', 'id': 'a phosphate monoester'}, {
    'name': '(9Z,11E)-octadecadienoate',
    'id': '(9Z,11E)-octadecadienoate',
  }, {
    'name': '1,2-dioctanoyl-sn-glycero-3-phospho-(1-D-myo-inositol-4-phosphate)',
    'id': '1,2-dioctanoyl-sn-glycero-3-phospho-(1-D-myo-inositol-4-phosphate)',
  }, {'name': '(2R,3S)-2,3-dimethylmalate', 'id': '(2R,3S)-2,3-dimethylmalate'}, {
    'name': '4-methylumbelliferone',
    'id': '4-methylumbelliferone',
  }, {
    'name': 'alpha-D-Gal-(1->3)-[alpha-L-Fuc-(1->2)]-beta-D-Gal-(1->3)-alpha-D-GalNAc-(1->3)-alpha-D-GalNAc-diphospho-di-trans,octa-cis-undecaprenol',
    'id': 'alpha-D-Gal-(1->3)-[alpha-L-Fuc-(1->2)]-beta-D-Gal-(1->3)-alpha-D-GalNAc-(1->3)-alpha-D-GalNAc-diphospho-di-trans,octa-cis-undecaprenol',
  }, {
    'name': 'alpha-Kdo-(2->8)-alpha-Kdo-(2->4)-alpha-Kdo-(2->6)-lipid IVA',
    'id': 'alpha-Kdo-(2->8)-alpha-Kdo-(2->4)-alpha-Kdo-(2->6)-lipid IVA',
  }, {'name': '(S)-carnitinyl-CoA', 'id': '(S)-carnitinyl-CoA'}, {
    'name': '(3R)-piperidine-3-carboxamide',
    'id': '(3R)-piperidine-3-carboxamide',
  }, {'name': '3-methyl-L-tyrosine', 'id': '3-methyl-L-tyrosine'}, {
    'name': 'cyclic dehypoxanthinylfutalosinate',
    'id': 'cyclic dehypoxanthinylfutalosinate',
  }, {'name': '3-hydroxyicosanoyl-CoA', 'id': '3-hydroxyicosanoyl-CoA'}, {
    'name': '8-demethyl-8-alpha-L-rhamnosyl-tetracenomycin C',
    'id': '8-demethyl-8-alpha-L-rhamnosyl-tetracenomycin C',
  }, {'name': 'menaquinol-6', 'id': 'menaquinol-6'}, {'name': 'H(+)', 'id': 'H(+)'}, {
    'name': 'L-tyrosine O-sulfate residue',
    'id': 'L-tyrosine O-sulfate residue',
  }, {'name': '4-aminobutanoate', 'id': '4-aminobutanoate'}, {
    'name': 'CDP-4-dehydro-3,6-dideoxy-alpha-D-glucose',
    'id': 'CDP-4-dehydro-3,6-dideoxy-alpha-D-glucose',
  }, {'name': 'N-(2-hydroxytetracosanoyl)phytosphingosine', 'id': 'N-(2-hydroxytetracosanoyl)phytosphingosine'}, {
    'name': '4-sulfomuconolactone',
    'id': '4-sulfomuconolactone',
  }, {'name': '5,10-methenyltetrahydrofolate', 'id': '5,10-methenyltetrahydrofolate'}, {
    'name': '2,3-bis-(O-geranylgeranyl)-sn-glycerol 1-phosphate',
    'id': '2,3-bis-(O-geranylgeranyl)-sn-glycerol 1-phosphate',
  }, {'name': '11-cis-retinal', 'id': '11-cis-retinal'}, {
    'name': 'rifamycin O',
    'id': 'rifamycin O',
  }, {
    'name': 'beta-D-4-deoxy-Delta(4)-GlcpA-(1->3)-beta-D-GalpNAc6S',
    'id': 'beta-D-4-deoxy-Delta(4)-GlcpA-(1->3)-beta-D-GalpNAc6S',
  }, {'name': '3,7,11,15-tetramethylhexadecanoyl-CoA', 'id': '3,7,11,15-tetramethylhexadecanoyl-CoA'}, {
    'name': 'aureusidin',
    'id': 'aureusidin',
  }, {
    'name': 'UDP-2,3-diacetamido-2,3-dideoxy-alpha-D-glucuronate',
    'id': 'UDP-2,3-diacetamido-2,3-dideoxy-alpha-D-glucuronate',
  }, {'name': '(2E,8Z,11Z,14Z,17Z,20Z,23Z)-hexacosaheptaenoyl-CoA', 'id': '(2E,8Z,11Z,14Z,17Z,20Z,23Z)-hexacosaheptaenoyl-CoA'}, {
    'name': 'salicylate',
    'id': 'salicylate',
  }, {
    'name': '2-(beta-D-glucuronosyl)-D-glucuronate',
    'id': '2-(beta-D-glucuronosyl)-D-glucuronate',
  }, {
    'name': 'trans-2-chloro-4-carboxymethylenebut-2-en-1,4-olide',
    'id': 'trans-2-chloro-4-carboxymethylenebut-2-en-1,4-olide',
  }, {'name': 'O-phospho-L-threonine residue', 'id': 'O-phospho-L-threonine residue'}, {
    'name': '(3Z)-hexenoyl-CoA',
    'id': '(3Z)-hexenoyl-CoA',
  }, {'name': 'D-serine', 'id': 'D-serine'}, {
    'name': '3-hydroxy-4-methylanthranilate',
    'id': '3-hydroxy-4-methylanthranilate',
  }, {'name': 'iron(III) oxide-hydroxide', 'id': 'iron(III) oxide-hydroxide'}, {
    'name': '4-hydroxy-6-undecylpyran-2-one',
    'id': '4-hydroxy-6-undecylpyran-2-one',
  }, {'name': '(1S,5S)-sabinone', 'id': '(1S,5S)-sabinone'}, {
    'name': 'trans-4-coumaroylshikimate',
    'id': 'trans-4-coumaroylshikimate',
  }, {'name': 'cholest-4-en-3-one', 'id': 'cholest-4-en-3-one'}, {'name': '2,2-dialkylglycine', 'id': '2,2-dialkylglycine'}];

  public selectedModel: Observable<types.DeCaF.Model>;
  public models: Observable<types.DeCaF.Model[]>;

  constructor(
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(new FetchSpeciesDesign());
    this.store.dispatch(new FetchModelsDesign());
    /* Just to make it works, I am going to change it for a new store*/
    this.allSpecies = this.store.pipe(select((store) => store.designTool.allSpecies));


    this.models = this.store.pipe(select(activeModels));

    this.subscription = this.store.select('designTool')
      .subscribe(
        (data) => {
          console.log('DTA', data);
           if (data.selectedSpecies) {
            this.designForm.setValue({
              species: data.selectedSpecies,
              product: {
                'name': 'trans-2-chloro-4-carboxymethylenebut-2-en-1,4-olide',
                'id': 'trans-2-chloro-4-carboxymethylenebut-2-en-1,4-olide',
              },
              bigg: false,
              kegg: false,
              rhea: false,
              model: {},
              number_pathways: 10,
            });
          }
        },
      );
  }

  ngAfterViewInit(): void {
  }

  // tslint:disable-next-line:no-any
  displayFn(item: any): string {
    return item ? item.name : '';
  }

  onSubmit(): void {
    this.store.dispatch(new StartDesign(this.designForm.value));
  }
}
