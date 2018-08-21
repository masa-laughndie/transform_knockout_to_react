import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ko from "knockout";

const gon = { item: { on_sale_on_imasia: false } };

class AppViewModel {
  state = {
    showSubscriptionSizes: true,
    onSale: false
  };

  sizes = new SizesViewModel();

  showSubscriptionSizes = ko.observable(true);
  onSale = ko.observable(gon.item.on_sale_on_imasia);

  hidden = ko.computed(() => {
    return this.showSubscriptionSizes() && this.onSale();
  });
}

class SizesViewModel {
  standardPrice = ko.observable(true);

  toggleStandardPrice = (_data, _event) => {
    this.standardPrice(!this.standardPrice());
  };

  togglePriceLink = ko.computed(() => {
    const priceType = this.standardPrice() ? "prepaid" : "standard";
    const text = `views.items.show.price-table.price.${priceType}`;

    return `<i class="fa fa-exchange"></i>${text}`;
  });
}

interface Props {}

interface State {
  standardPrice: boolean;
  showSubscriptionSizes: boolean;
  onSale: boolean;
}

class Component extends React.Component<Props, State> {
  state: State = {
    standardPrice: true,
    showSubscriptionSizes: true,
    onSale: false
  };

  constructor(props) {
    super(props);
    props.appVM.sizes.standardPrice.subscribe(standardPrice =>
      this.setState({ standardPrice })
    );
    props.appVM.onSale.subscribe(onSale => this.setState({ onSale }));
  }

  togglePriceLink = () => {
    return this.props.appVM.sizes.togglePriceLink();
    // const priceType = this.state.standardPrice ? "prepaid" : "standard";
    // const text = `views.items.show.price-table.price.${priceType}`;

    // return `<i class="fa fa-exchange"></i>${text}`;
  };

  handleClick = event => {
    event.preventDefault();
    this.props.appVM.sizes.toggleStandardPrice();
  };

  hidden = () => {
    return this.props.appVM.hidden();
  };

  render() {
    if (this.hidden()) {
      return null;
    }

    return (
      <a
        className="product-price-tabs__change"
        href=""
        onClick={this.handleClick}
      >
        <span dangerouslySetInnerHTML={{ __html: this.togglePriceLink() }} />
        {/*<%= t('views.items.show.price-table.price.prepaid') %>*/}
      </a>
    );
  }
}
const appVM = new AppViewModel();

ReactDOM.render(<Component appVM={appVM} />, document.getElementById("test"));

// Activates knockout.js
ko.applyBindings(appVM, document.getElementById("test"));
