// Browser only polyfill

import type {
	PathProps,
	GroupProps,
	ImageProps,
	BlurImageFilterProps,
	MatrixColorFilterProps,
	CircleProps,
	BlurMaskFilterProps,
	LinearGradientProps,
	PaintProps,
	ShaderProps,
	ImageShaderProps,
	LineProps,
	OvalProps,
	PatchProps,
	PointsProps,
	RectProps,
	RoundedRectProps,
	VerticesProps,
	TextProps,
	DiffRectProps,
	OffsetImageFilterProps,
	BlendColorFilterProps,
	TextPathProps,
	TextBlobProps,
	GlyphsProps,
	TwoPointConicalGradientProps,
	TurbulenceProps,
	SweepGradientProps,
	RadialGradientProps,
	FractalNoiseProps,
	ColorProps,
	PictureProps,
	ImageSVGProps,
	LerpColorFilterProps,
	DrawingNodeProps,
	BoxProps,
	BoxShadowProps,
	ChildrenProps,
	AtlasProps,
	BlendImageFilterProps,
	BlendProps,
	DisplacementMapImageFilterProps,
	DropShadowImageFilterProps,
	MorphologyImageFilterProps,
	RuntimeShaderImageFilterProps,
	CornerPathEffectProps,
	DashPathEffectProps,
	DiscretePathEffectProps,
	Line2DPathEffectProps,
	Path1DPathEffectProps,
	Path2DPathEffectProps,
	ParagraphProps,
} from "@shopify/react-native-skia";

const { Skia } =
	require("@shopify/react-native-skia/src/") as typeof import("@shopify/react-native-skia/lib/typescript/src/");

const {
	FillNode,
	ImageNode,
	CircleNode,
	PathNode,
	LineNode,
	PatchNode,
	PointsNode,
	RectNode,
	RRectNode,
	VerticesNode,
	TextNode,
	OvalNode,
	TextPathNode,
	TextBlobNode,
	GlyphsNode,
	DiffRectNode,
	PictureNode,
	ImageSVGNode,
	BackdropFilterNode,
	BoxNode,
	BoxShadowNode,
	AtlasNode,
} =
	require("@shopify/react-native-skia/src/dom/nodes/drawings") as typeof import("@shopify/react-native-skia/lib/typescript/src/dom/nodes/drawings");

const { GroupNode } =
	require("@shopify/react-native-skia/src/dom/nodes/GroupNode") as typeof import("@shopify/react-native-skia/lib/typescript/src/dom/nodes/GroupNode");

const { PaintNode } =
	require("@shopify/react-native-skia/src/dom/nodes/PaintNode") as typeof import("@shopify/react-native-skia/lib/typescript/src/dom/nodes/PaintNode");

const { LayerNode } =
	require("@shopify/react-native-skia/src/dom/nodes/LayerNode") as typeof import("@shopify/react-native-skia/lib/typescript/src/dom/nodes/LayerNode");

const { ParagraphNode } =
	require("@shopify/react-native-skia/src/dom/nodes/drawings/ParagraphNode") as typeof import("@shopify/react-native-skia/lib/typescript/src/dom/nodes/drawings/ParagraphNode");

const {
	LinearGradientNode,
	ShaderNode,
	ImageShaderNode,
	TwoPointConicalGradientNode,
	TurbulenceNode,
	SweepGradientNode,
	RadialGradientNode,
	FractalNoiseNode,
	ColorNode,
} =
	require("@shopify/react-native-skia/src/dom/nodes/paint/Shaders") as typeof import("@shopify/react-native-skia/lib/typescript/src/dom/nodes/paint/Shaders");

const {
	MatrixColorFilterNode,
	LumaColorFilterNode,
	LinearToSRGBGammaColorFilterNode,
	SRGBToLinearGammaColorFilterNode,
	BlendColorFilterNode,
	LerpColorFilterNode,
} =
	require("@shopify/react-native-skia/src/dom/nodes/paint/ColorFilters") as typeof import("@shopify/react-native-skia/lib/typescript/src/dom/nodes/paint/ColorFilters");

const {
	BlendImageFilterNode,
	BlurImageFilterNode,
	BlurMaskFilterNode,
	DisplacementMapImageFilterNode,
	DropShadowImageFilterNode,
	OffsetImageFilterNode,
	RuntimeShaderImageFilterNode,
	CornerPathEffectNode,
	DiscretePathEffectNode,
	DashPathEffectNode,
	Path1DPathEffectNode,
	Path2DPathEffectNode,
	SumPathEffectNode,
	Line2DPathEffectNode,
	BlendNode,
} =
	require("@shopify/react-native-skia/src/dom/nodes/paint") as typeof import("@shopify/react-native-skia/lib/typescript/src/dom/nodes/paint");

const { MorphologyImageFilterNode } =
	require("@shopify/react-native-skia/src/dom/nodes/paint/ImageFilters") as typeof import("@shopify/react-native-skia/lib/typescript/src/dom/nodes/paint/ImageFilters");

const ctx = { Skia };

globalThis.SkiaViewApi = {
	setJsiProperty() {},
	requestRedraw() {},
};

globalThis.SkiaDomApi = {
	RectNode: (props: RectProps) => new RectNode(ctx, props),
	RRectNode: (props: RoundedRectProps) => new RRectNode(ctx, props) as any,
	GroupNode: (props: GroupProps) => new GroupNode(ctx, props),
	PaintNode: (props: PaintProps) => new PaintNode(ctx, props),
	FillNode: (props: DrawingNodeProps) => new FillNode(ctx, props),
	CircleNode: (props: CircleProps) => new CircleNode(ctx, props),
	PathNode: (props: PathProps) => new PathNode(ctx, props),
	LineNode: (props: LineProps) => new LineNode(ctx, props),
	ImageNode: (props: ImageProps) => new ImageNode(ctx, props),
	OvalNode: (props: OvalProps) => new OvalNode(ctx, props),
	PatchNode: (props: PatchProps) => new PatchNode(ctx, props),
	PointsNode: (props: PointsProps) => new PointsNode(ctx, props),
	DiffRectNode: (props: DiffRectProps) => new DiffRectNode(ctx, props),
	AtlasNode: (props: AtlasProps) => new AtlasNode(ctx, props),
	BlurMaskFilterNode: (props: BlurMaskFilterProps) => new BlurMaskFilterNode(ctx, props),
	DashPathEffectNode: (props: DashPathEffectProps) => new DashPathEffectNode(ctx, props),
	DiscretePathEffectNode: (props: DiscretePathEffectProps) => new DiscretePathEffectNode(ctx, props),
	CornerPathEffectNode: (props: CornerPathEffectProps) => new CornerPathEffectNode(ctx, props),
	Path1DPathEffectNode: (props: Path1DPathEffectProps) => new Path1DPathEffectNode(ctx, props),
	Path2DPathEffectNode: (props: Path2DPathEffectProps) => new Path2DPathEffectNode(ctx, props),
	Line2DPathEffectNode: (props: Line2DPathEffectProps) => new Line2DPathEffectNode(ctx, props),
	SumPathEffectNode: () => new SumPathEffectNode(ctx),
	BlendImageFilterNode: (props: BlendImageFilterProps) => new BlendImageFilterNode(ctx, props),
	DropShadowImageFilterNode: (props: DropShadowImageFilterProps) => new DropShadowImageFilterNode(ctx, props),
	DisplacementMapImageFilterNode: (props: DisplacementMapImageFilterProps) =>
		new DisplacementMapImageFilterNode(ctx, props),
	BlurImageFilterNode: (props: BlurImageFilterProps) => new BlurImageFilterNode(ctx, props),
	OffsetImageFilterNode: (props: OffsetImageFilterProps) => new OffsetImageFilterNode(ctx, props),
	MorphologyImageFilterNode: (props: MorphologyImageFilterProps) => new MorphologyImageFilterNode(ctx, props),
	RuntimeShaderImageFilterNode: (props: RuntimeShaderImageFilterProps) =>
		new RuntimeShaderImageFilterNode(ctx, props),
	MatrixColorFilterNode: (props: MatrixColorFilterProps) => new MatrixColorFilterNode(ctx, props),
	BlendColorFilterNode: (props: BlendColorFilterProps) => new BlendColorFilterNode(ctx, props),
	LinearToSRGBGammaColorFilterNode: () => new LinearToSRGBGammaColorFilterNode(ctx),
	SRGBToLinearGammaColorFilterNode: () => new SRGBToLinearGammaColorFilterNode(ctx),
	LumaColorFilterNode: () => new LumaColorFilterNode(ctx),
	LerpColorFilterNode: (props: LerpColorFilterProps) => new LerpColorFilterNode(ctx, props),
	ShaderNode: (props: ShaderProps) => new ShaderNode(ctx, props),
	ImageShaderNode: (props: ImageShaderProps) => new ImageShaderNode(ctx, props),
	ColorShaderNode: (props: ColorProps) => new ColorNode(ctx, props),
	TurbulenceNode: (props: TurbulenceProps) => new TurbulenceNode(ctx, props),
	FractalNoiseNode: (props: FractalNoiseProps) => new FractalNoiseNode(ctx, props),
	LinearGradientNode: (props: LinearGradientProps) => new LinearGradientNode(ctx, props),
	RadialGradientNode: (props: RadialGradientProps) => new RadialGradientNode(ctx, props),
	SweepGradientNode: (props: SweepGradientProps) => new SweepGradientNode(ctx, props),
	TwoPointConicalGradientNode: (props: TwoPointConicalGradientProps) => new TwoPointConicalGradientNode(ctx, props),
	PictureNode: (props: PictureProps) => new PictureNode(ctx, props),
	ImageSVGNode: (props: ImageSVGProps) => new ImageSVGNode(ctx, props),
	VerticesNode: (props: VerticesProps) => new VerticesNode(ctx, props),
	TextNode: (props: TextProps) => new TextNode(ctx, props),
	TextPathNode: (props: TextPathProps) => new TextPathNode(ctx, props),
	TextBlobNode: (props: TextBlobProps) => new TextBlobNode(ctx, props),
	GlyphsNode: (props: GlyphsProps) => new GlyphsNode(ctx, props),
	BlendNode: (props: BlendProps) => new BlendNode(ctx, props),
	BackdropFilterNode: (props: ChildrenProps) => new BackdropFilterNode(ctx, props),
	BoxNode: (props: BoxProps) => new BoxNode(ctx, props),
	BoxShadowNode: (props: BoxShadowProps) => new BoxShadowNode(ctx, props),
	LayerNode: (props: ChildrenProps) => new LayerNode(ctx, props),
	ParagraphNode: (props: ParagraphProps) => new ParagraphNode(ctx, props),
};
