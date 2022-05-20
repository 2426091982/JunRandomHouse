import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 导入vant框架
import {
  Button,
  Icon,
  Grid,
  GridItem,
  Image,
  Lazyload,
  Rate,
  Circle,
  Tab,
  Tabs,
  Badge,
  Search,
  Swipe,
  SwipeItem,
  Sticky,
  Toast,
  Sidebar,
  SidebarItem,
  Col,
  Row,
  Collapse,
  CollapseItem,
  Card,
  Empty,
  PullRefresh,
  Form,
  Field,
  Divider,
  SwipeCell,
  SubmitBar,
  Checkbox,
  CheckboxGroup,
  Dialog,
  AddressList,
  AddressEdit,
  Popup,
  Uploader,
  List,
  Cell
} from "vant";

const app = createApp(App);

app
  .use(Dialog)
  .use(Cell)
  .use(List)
  .use(Checkbox)
  .use(Uploader)
  .use(AddressEdit)
  .use(Popup)
  .use(AddressList)
  .use(CheckboxGroup)
  .use(Button)
  .use(Icon)
  .use(Grid)
  .use(GridItem)
  .use(Image)
  .use(Rate)
  .use(Circle)
  .use(Tab)
  .use(Tabs)
  .use(Badge)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(SubmitBar)
  .use(Sticky)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Col)
  .use(Row)
  .use(Collapse)
  .use(CollapseItem)
  .use(Card)
  .use(Empty)
  .use(PullRefresh)
  .use(Form)
  .use(Field)
  .use(Divider)
  .use(SwipeCell)
  .use(Toast)
  .use(Lazyload)
  .use(store)
  .use(router)
  .mount("#app");
