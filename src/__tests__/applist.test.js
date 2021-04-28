import { shallowMount } from "@vue/test-utils";
import AppsList from "./../components/Dashboard/AppsList";
import Vuetify from "vuetify";
jest.mock("axios", () => ({
  request: () => Promise.resolve({ data: [{ val: 1 }] }),
}));

describe("AppsList.vue", () => {
  it("mocking the axios call to get apps list should work", () => {
    var wrapper = shallowMount(AppsList);
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.applist.length).toBe(1);
    });
  });
});
