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

export default {
  menu: 'zoom',
  scroll_behavior: 'zoom',
  fill_screen: false,
  ignore_bootstrap: true,
  never_ask_before_quit: true,
  reaction_styles: ['color', 'size', 'text', 'abs'],
  identifiers_on_map: 'bigg_id',
  hide_all_labels: false,
  hide_secondary_metabolites: false,
  highlight_missing: true,
  reaction_scale: [
    { type: 'min', color: '#A841D0', size: 20 },
    { type: 'Q1', color: '#868BB2', size: 20 },
    { type: 'Q3', color: '#6DBFB0', size: 20 },
    { type: 'max', color: '#54B151', size: 20 },
  ],
  reaction_no_data_color: '#CBCBCB',
  reaction_no_data_size: 10,
  tooltip: 'custom',
  tooltip_callbacks: null,
  enable_editing: false,
  show_gene_reaction_rules: true,
  zoom_extent_canvas: true,
};
