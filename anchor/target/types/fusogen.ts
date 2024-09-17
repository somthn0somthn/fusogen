/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fusogen.json`.
 */
export type Fusogen = {
  address: '8u5DoSAV7cZxQAPYumVRZCJeYoijkkjCHsGgC6gKyp4m';
  metadata: {
    name: 'fusogen';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'greet';
      discriminator: [203, 194, 3, 150, 228, 58, 181, 62];
      accounts: [];
      args: [];
    }
  ];
};
