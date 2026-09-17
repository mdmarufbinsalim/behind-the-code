import { Figure } from "./Figure";
import { Callout } from "./Callout";
import { Video } from "./Video";
import { Facts, Fact } from "./Facts";
import { Illustration } from "./Illustration";

import { Expandable, ExpandableDetail } from "./Expandable";
import { DocumentFlowDiagram } from "./clerkal/DocumentFlowDiagram";
import { NinetyTenSplit } from "./clerkal/NinetyTenSplit";
import { OcrPipeline } from "./qabiile/OcrPipeline";
import { EscrowLifecycle } from "./qabiile/EscrowLifecycle";
import { ContractFlow } from "./qabiile/ContractFlow";
import { StackMatrix } from "./qabiile/StackMatrix";
import { PlatformSurface } from "./qabiile/PlatformSurface";
import { InviteFunnel } from "./qabiile/InviteFunnel";
import { EarningLoop } from "./qabiile/EarningLoop";
import { ReelPipeline } from "./qabiile/ReelPipeline";
import { PhoneRow, Phone } from "./qabiile/PhoneRow";
import { TenancyDiagram } from "./finzeka/TenancyDiagram";
import { AdapterFacadeDiagram } from "./finzeka/AdapterFacadeDiagram";
import { RbacDiagram } from "./finzeka/RbacDiagram";

/** Components case-study MDX bodies can reach for. */
export const mdxComponents = {
  Figure,
  Callout,
  Video,
  Facts,
  Fact,
  Illustration,
  Expandable,
  ExpandableDetail,
  DocumentFlowDiagram,
  NinetyTenSplit,
  // Qabiile: the shape of these flows is the argument, so they're drawn.
  OcrPipeline,
  EscrowLifecycle,
  ContractFlow,
  InviteFunnel,
  EarningLoop,
  ReelPipeline,
  StackMatrix,
  PlatformSurface,
  PhoneRow,
  Phone,
  // Finzeka: schema-per-tenant, adapters behind a facade, permission-as-data RBAC.
  TenancyDiagram,
  AdapterFacadeDiagram,
  RbacDiagram,
};
