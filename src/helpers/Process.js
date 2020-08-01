function list_to_tree(list) {
  var map = {}, node, roots = [], i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].childrens = []; // initialize the childrens
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parent_id !== null) {
      // if you have dangling branches check that map[node.parent_id] exists
      list[map[node.parent_id]].childrens.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function makeFormula(data, item) {
  return `${data}['${item.field}'] ${item.equation} '${item.value}'`;
}

function getLogic(formula, rules, data, boundary = false) {
  if (boundary) {
    formula += "(";
  }
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (i !== 0) {
      formula += (' ' + rule["logic"] + ' ');
    }
    if (rule['equation'] === 'formula') {
      formula += getLogic('', rule['childrens'], data, true);
    } else {
      formula += makeFormula(data, rule);
    }
  }
  if (boundary) {
    formula += ")";
  }

  return formula;
}

export const isUpgradeable = (group, data) => {
  if (group.process_rules.length === 0) {
    return true;
  }
  let { process_rules } = group;
  process_rules = list_to_tree(process_rules);
  let formula = '';
  formula = getLogic(formula, process_rules, 'data');
  let isUpgradeable = false;
  try {
    eval(`isUpgradeable = ${formula}`);
  } catch (error) {
    console.log(error);
    
    isUpgradeable = false;
  }

  return isUpgradeable;
}