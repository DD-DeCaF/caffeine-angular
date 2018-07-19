
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
};
