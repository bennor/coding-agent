import { gateway } from "@ai-sdk/gateway";
import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
import * as flags from "../../../../lib/flags";

export const GET = createFlagsDiscoveryEndpoint(async () => {
  const providerData = getProviderData(flags);
  const model = providerData.definitions.model;
  const { models } = await gateway.getAvailableModels();
  model.options = models
    .filter((m) => m.modelType === "language")
    .map((m) => ({ value: m.id, label: m.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return providerData;
});
