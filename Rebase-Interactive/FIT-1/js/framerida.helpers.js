(function (H) {
  H.registerHelper('validState', function (stateValue, options) {
    var isValid = stateValue && (stateValue.toLowerCase() !== "all");
    return (isValid) ? options.fn(this) : options.inverse(this);
  });

  H.registerHelper('pluralize', function (total, singular, plural, none) {
    total = +total;
    if (total === 0 && none) {
      return none;
    }
    if (total === 1) {
      return singular;
    }
    return plural;
  });


  H.registerHelper('displayTotalRecords', function (total) {
    return total === 0 ? '' : (total >= 100 ? '100+' : total);
  });

  H.registerHelper('nameize', function (item) {
    if (!item) return "";
    return item.nameize();
  });
}(Handlebars));
