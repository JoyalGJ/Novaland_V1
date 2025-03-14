const e=JSON.parse('[{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"CLOCK_MODE","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"DEFAULT_ADMIN_ROLE","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"DOMAIN_SEPARATOR","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"allowance","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"approve","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"burn","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"burnFrom","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"checkpoints","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"pos","type":"uint32","internalType":"uint32"}],"outputs":[{"name":"","type":"tuple","internalType":"struct ERC20VotesUpgradeable.Checkpoint","components":[{"name":"fromBlock","type":"uint32","internalType":"uint32"},{"name":"votes","type":"uint224","internalType":"uint224"}]}],"stateMutability":"view"},{"type":"function","name":"claim","inputs":[{"name":"_receiver","type":"address","internalType":"address"},{"name":"_quantity","type":"uint256","internalType":"uint256"},{"name":"_currency","type":"address","internalType":"address"},{"name":"_pricePerToken","type":"uint256","internalType":"uint256"},{"name":"_allowlistProof","type":"tuple","internalType":"struct IDrop.AllowlistProof","components":[{"name":"proof","type":"bytes32[]","internalType":"bytes32[]"},{"name":"quantityLimitPerWallet","type":"uint256","internalType":"uint256"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"}]},{"name":"_data","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"claimCondition","inputs":[],"outputs":[{"name":"currentStartId","type":"uint256","internalType":"uint256"},{"name":"count","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"clock","inputs":[],"outputs":[{"name":"","type":"uint48","internalType":"uint48"}],"stateMutability":"view"},{"type":"function","name":"contractType","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"pure"},{"type":"function","name":"contractURI","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"contractVersion","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"pure"},{"type":"function","name":"decimals","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"decreaseAllowance","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"subtractedValue","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"delegate","inputs":[{"name":"delegatee","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"delegateBySig","inputs":[{"name":"delegatee","type":"address","internalType":"address"},{"name":"nonce","type":"uint256","internalType":"uint256"},{"name":"expiry","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"delegates","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"eip712Domain","inputs":[],"outputs":[{"name":"fields","type":"bytes1","internalType":"bytes1"},{"name":"name","type":"string","internalType":"string"},{"name":"version","type":"string","internalType":"string"},{"name":"chainId","type":"uint256","internalType":"uint256"},{"name":"verifyingContract","type":"address","internalType":"address"},{"name":"salt","type":"bytes32","internalType":"bytes32"},{"name":"extensions","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getActiveClaimConditionId","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getClaimConditionById","inputs":[{"name":"_conditionId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"condition","type":"tuple","internalType":"struct IClaimCondition.ClaimCondition","components":[{"name":"startTimestamp","type":"uint256","internalType":"uint256"},{"name":"maxClaimableSupply","type":"uint256","internalType":"uint256"},{"name":"supplyClaimed","type":"uint256","internalType":"uint256"},{"name":"quantityLimitPerWallet","type":"uint256","internalType":"uint256"},{"name":"merkleRoot","type":"bytes32","internalType":"bytes32"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"},{"name":"metadata","type":"string","internalType":"string"}]}],"stateMutability":"view"},{"type":"function","name":"getFlatPlatformFeeInfo","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getPastTotalSupply","inputs":[{"name":"timepoint","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getPastVotes","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"timepoint","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getPlatformFeeInfo","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint16","internalType":"uint16"}],"stateMutability":"view"},{"type":"function","name":"getPlatformFeeType","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"enum IPlatformFee.PlatformFeeType"}],"stateMutability":"view"},{"type":"function","name":"getRoleAdmin","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"getRoleMember","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"index","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"member","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getRoleMemberCount","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"count","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getSupplyClaimedByWallet","inputs":[{"name":"_conditionId","type":"uint256","internalType":"uint256"},{"name":"_claimer","type":"address","internalType":"address"}],"outputs":[{"name":"supplyClaimedByWallet","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getVotes","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"grantRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"hasRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"hasRoleWithSwitch","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"increaseAllowance","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"addedValue","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"initialize","inputs":[{"name":"_defaultAdmin","type":"address","internalType":"address"},{"name":"_name","type":"string","internalType":"string"},{"name":"_symbol","type":"string","internalType":"string"},{"name":"_contractURI","type":"string","internalType":"string"},{"name":"_trustedForwarders","type":"address[]","internalType":"address[]"},{"name":"_saleRecipient","type":"address","internalType":"address"},{"name":"_platformFeeRecipient","type":"address","internalType":"address"},{"name":"_platformFeeBps","type":"uint128","internalType":"uint128"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"isTrustedForwarder","inputs":[{"name":"forwarder","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"maxTotalSupply","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"multicall","inputs":[{"name":"data","type":"bytes[]","internalType":"bytes[]"}],"outputs":[{"name":"results","type":"bytes[]","internalType":"bytes[]"}],"stateMutability":"nonpayable"},{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"nonces","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"numCheckpoints","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint32","internalType":"uint32"}],"stateMutability":"view"},{"type":"function","name":"permit","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"primarySaleRecipient","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"renounceRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"revokeRole","inputs":[{"name":"role","type":"bytes32","internalType":"bytes32"},{"name":"account","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setClaimConditions","inputs":[{"name":"_conditions","type":"tuple[]","internalType":"struct IClaimCondition.ClaimCondition[]","components":[{"name":"startTimestamp","type":"uint256","internalType":"uint256"},{"name":"maxClaimableSupply","type":"uint256","internalType":"uint256"},{"name":"supplyClaimed","type":"uint256","internalType":"uint256"},{"name":"quantityLimitPerWallet","type":"uint256","internalType":"uint256"},{"name":"merkleRoot","type":"bytes32","internalType":"bytes32"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"},{"name":"metadata","type":"string","internalType":"string"}]},{"name":"_resetClaimEligibility","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setContractURI","inputs":[{"name":"_uri","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setFlatPlatformFeeInfo","inputs":[{"name":"_platformFeeRecipient","type":"address","internalType":"address"},{"name":"_flatFee","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setMaxTotalSupply","inputs":[{"name":"_maxTotalSupply","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setPlatformFeeInfo","inputs":[{"name":"_platformFeeRecipient","type":"address","internalType":"address"},{"name":"_platformFeeBps","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setPlatformFeeType","inputs":[{"name":"_feeType","type":"uint8","internalType":"enum IPlatformFee.PlatformFeeType"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setPrimarySaleRecipient","inputs":[{"name":"_saleRecipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"transfer","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"transferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"verifyClaim","inputs":[{"name":"_conditionId","type":"uint256","internalType":"uint256"},{"name":"_claimer","type":"address","internalType":"address"},{"name":"_quantity","type":"uint256","internalType":"uint256"},{"name":"_currency","type":"address","internalType":"address"},{"name":"_pricePerToken","type":"uint256","internalType":"uint256"},{"name":"_allowlistProof","type":"tuple","internalType":"struct IDrop.AllowlistProof","components":[{"name":"proof","type":"bytes32[]","internalType":"bytes32[]"},{"name":"quantityLimitPerWallet","type":"uint256","internalType":"uint256"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"}]}],"outputs":[{"name":"isOverride","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"event","name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"spender","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ClaimConditionsUpdated","inputs":[{"name":"claimConditions","type":"tuple[]","indexed":false,"internalType":"struct IClaimCondition.ClaimCondition[]","components":[{"name":"startTimestamp","type":"uint256","internalType":"uint256"},{"name":"maxClaimableSupply","type":"uint256","internalType":"uint256"},{"name":"supplyClaimed","type":"uint256","internalType":"uint256"},{"name":"quantityLimitPerWallet","type":"uint256","internalType":"uint256"},{"name":"merkleRoot","type":"bytes32","internalType":"bytes32"},{"name":"pricePerToken","type":"uint256","internalType":"uint256"},{"name":"currency","type":"address","internalType":"address"},{"name":"metadata","type":"string","internalType":"string"}]},{"name":"resetEligibility","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false},{"type":"event","name":"ContractURIUpdated","inputs":[{"name":"prevURI","type":"string","indexed":false,"internalType":"string"},{"name":"newURI","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"DelegateChanged","inputs":[{"name":"delegator","type":"address","indexed":true,"internalType":"address"},{"name":"fromDelegate","type":"address","indexed":true,"internalType":"address"},{"name":"toDelegate","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"DelegateVotesChanged","inputs":[{"name":"delegate","type":"address","indexed":true,"internalType":"address"},{"name":"previousBalance","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"newBalance","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"EIP712DomainChanged","inputs":[],"anonymous":false},{"type":"event","name":"FlatPlatformFeeUpdated","inputs":[{"name":"platformFeeRecipient","type":"address","indexed":false,"internalType":"address"},{"name":"flatFee","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Initialized","inputs":[{"name":"version","type":"uint8","indexed":false,"internalType":"uint8"}],"anonymous":false},{"type":"event","name":"MaxTotalSupplyUpdated","inputs":[{"name":"maxTotalSupply","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"PlatformFeeInfoUpdated","inputs":[{"name":"platformFeeRecipient","type":"address","indexed":true,"internalType":"address"},{"name":"platformFeeBps","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"PlatformFeeTypeUpdated","inputs":[{"name":"feeType","type":"uint8","indexed":false,"internalType":"enum IPlatformFee.PlatformFeeType"}],"anonymous":false},{"type":"event","name":"PrimarySaleRecipientUpdated","inputs":[{"name":"recipient","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RoleAdminChanged","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"previousAdminRole","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"newAdminRole","type":"bytes32","indexed":true,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"RoleGranted","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"sender","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RoleRevoked","inputs":[{"name":"role","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"sender","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"TokensClaimed","inputs":[{"name":"claimConditionIndex","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"claimer","type":"address","indexed":true,"internalType":"address"},{"name":"receiver","type":"address","indexed":true,"internalType":"address"},{"name":"startTokenId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"quantityClaimed","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ContractMetadataUnauthorized","inputs":[]},{"type":"error","name":"CurrencyTransferLibFailedNativeTransfer","inputs":[{"name":"recipient","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"DropClaimExceedLimit","inputs":[{"name":"expected","type":"uint256","internalType":"uint256"},{"name":"actual","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"DropClaimExceedMaxSupply","inputs":[{"name":"expected","type":"uint256","internalType":"uint256"},{"name":"actual","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"DropClaimInvalidTokenPrice","inputs":[{"name":"expectedCurrency","type":"address","internalType":"address"},{"name":"expectedPricePerToken","type":"uint256","internalType":"uint256"},{"name":"actualCurrency","type":"address","internalType":"address"},{"name":"actualExpectedPricePerToken","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"DropClaimNotStarted","inputs":[{"name":"expected","type":"uint256","internalType":"uint256"},{"name":"actual","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"DropExceedMaxSupply","inputs":[]},{"type":"error","name":"DropNoActiveCondition","inputs":[]},{"type":"error","name":"DropUnauthorized","inputs":[]},{"type":"error","name":"PermissionsAlreadyGranted","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"role","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"PermissionsInvalidPermission","inputs":[{"name":"expected","type":"address","internalType":"address"},{"name":"actual","type":"address","internalType":"address"}]},{"type":"error","name":"PermissionsUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"neededRole","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"PlatformFeeExceededMaxFeeBps","inputs":[{"name":"max","type":"uint256","internalType":"uint256"},{"name":"actual","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"PlatformFeeInvalidRecipient","inputs":[{"name":"recipient","type":"address","internalType":"address"}]},{"type":"error","name":"PlatformFeeUnauthorized","inputs":[]},{"type":"error","name":"PrimarySaleInvalidRecipient","inputs":[{"name":"recipient","type":"address","internalType":"address"}]},{"type":"error","name":"PrimarySaleUnauthorized","inputs":[]}]');export{e as default};
