"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { createProduct, updateProduct, type CreateProductInput } from "@/app/actions/products";
import { routes } from "@/lib/constants/routes";
import { STANDARD_SPECIFICATIONS } from "@/lib/constants/product-specs";
import type { Product, ProductType } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductFormProps {
  initialData?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductRegistrationForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmation Dialog States
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isEditMode = !!initialData;

  // 기본 폼 상태
  const [name, setName] = useState(initialData?.name || "");
  const [productType, setProductType] = useState<ProductType | "">(initialData?.productType || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [description, setDescription] = useState(initialData?.description || "");

  // Applications 상태
  const [applications, setApplications] = useState<string[]>(
    initialData?.applications && initialData.applications.length > 0
      ? initialData.applications
      : [""]
  );

  // Specifications 상태
  const [specifications, setSpecifications] = useState<
    Array<{ key: string; label: string; value: string; unit: string; description?: string }>
  >(() => {
    if (initialData?.specifications) {
      // 기존 스펙 데이터를 배열 형태로 변환
      const existingSpecs = Object.entries(initialData.specifications).map(([key, val]) => {
        const standardSpec = STANDARD_SPECIFICATIONS.find((s) => s.key === key);
        return {
          key: key,
          label: standardSpec?.label || key, // 표준 스펙이면 라벨 사용, 아니면 키(커스텀 이름) 사용
          value: val.value,
          unit: val.unit,
          description: standardSpec?.description,
        };
      });
      
      // 표준 스펙 중 빠진 것들이 있다면 추가 (폼에는 항상 표시하고 싶다면)
      // 여기서는 기존 데이터가 있는 경우 기존 데이터 위주로 표시하되,
      // 표준 스펙 순서를 유지하고 싶다면 로직이 복잡해짐.
      // 간단하게 기존 데이터 + (표준 스펙 중 없는 것들) 방식보다는
      // 그냥 저장된 스펙만 보여주는게 수정 시 혼동이 적음.
      // 하지만 '새 제품 등록'시에는 표준 스펙이 미리 보였으므로, 수정 시에도 비슷하게 보이고 싶다면:
      // 일단 저장된 것만 보여줍니다. (사용자가 삭제했을 수도 있으므로)
      return existingSpecs;
    }

    return STANDARD_SPECIFICATIONS.map((spec) => ({
      key: spec.key,
      label: spec.label,
      value: "",
      unit: spec.unit,
      description: spec.description,
    }));
  });

  const handleAddApplication = () => {
    setApplications([...applications, ""]);
  };

  const handleRemoveApplication = (index: number) => {
    setApplications(applications.filter((_, i) => i !== index));
  };

  const handleApplicationChange = (index: number, value: string) => {
    const updated = [...applications];
    updated[index] = value;
    setApplications(updated);
  };

  const handleSpecificationChange = (index: number, value: string) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], value };
    setSpecifications(updated);
  };

  const handleAddCustomSpecification = () => {
    setSpecifications([
      ...specifications,
      { key: `custom_${Date.now()}`, label: "", value: "", unit: "" },
    ]);
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const validateAndGetInput = (): CreateProductInput | null => {
    // Applications 필터링
    const filteredApplications = applications.filter((app) => app.trim() !== "");

    // Specifications 필터링 및 변환
    const specs: Record<string, { value: string; unit: string }> = {};
    specifications.forEach((spec) => {
      if (spec.value.trim()) {
        const specKey = spec.key || spec.label.trim();
        if (specKey) {
          specs[specKey] = {
            value: spec.value.trim(),
            unit: spec.unit.trim() || "",
          };
        }
      }
    });

    if (!name.trim()) {
      setError("제품명은 필수입니다.");
      return null;
    }

    return {
      name,
      productType: productType || undefined,
      summary: summary.trim() || undefined,
      description: description.trim() || undefined,
      applications: filteredApplications.length > 0 ? filteredApplications : undefined,
      specifications: Object.keys(specs).length > 0 ? specs : undefined,
    };
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const input = validateAndGetInput();
    if (!input) return;

    if (isEditMode) {
      setShowUpdateConfirm(true);
    } else {
      // Create Mode directly submits
      await submitData(input);
    }
  };

  const submitData = async (input: CreateProductInput) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && initialData) {
        await updateProduct(initialData.id, input);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(routes.product(initialData.id));
        }
      } else {
        const product = await createProduct(input);
        router.push(routes.product(product.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "제품 저장 중 오류가 발생했습니다.");
      // 모달 닫기
      setShowUpdateConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    if (isEditMode) {
      setShowCancelConfirm(true);
    } else {
      router.back();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>제품의 기본 정보를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                제품명 <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: IGS-603, IGS-664, EG-20, GS-203"
                required
              />
              <p className="text-xs text-muted-foreground">
                품목명을 입력하세요 (예: IGS-603, EG-20 등)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="productType" className="text-sm font-medium">
                제품 타입
              </label>
              <select
                id="productType"
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductType | "")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">선택 안 함</option>
                <option value="Molded">Molded (상형 제품)</option>
                <option value="Extruded">Extruded (압출 제품)</option>
                <option value="CIP (Isotropic)">CIP (Isotropic)</option>
              </select>
              <p className="text-xs text-muted-foreground">
                제품의 제조 방식을 선택하세요. 선택하지 않아도 됩니다.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm font-medium">
                요약
              </label>
              <Input
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="제품에 대한 한 줄 요약"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                상세 설명
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="제품에 대한 상세한 설명을 입력하세요."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card>
          <CardHeader>
            <CardTitle>응용 분야</CardTitle>
            <CardDescription>이 제품이 사용되는 응용 분야를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {applications.map((app, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={app}
                  onChange={(e) => handleApplicationChange(index, e.target.value)}
                  placeholder="예: Industrial furnace linings"
                  className="flex-1"
                />
                {applications.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveApplication(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddApplication} className="w-full">
              <Plus className="h-4 w-4" />
              응용 분야 추가
            </Button>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>스펙</CardTitle>
            <CardDescription>
              제품의 기술적 스펙을 입력하세요. 표준 스펙 필드가 미리 준비되어 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {specifications.map((spec, index) => {
                const isStandardSpec = STANDARD_SPECIFICATIONS.some((s) => s.key === spec.key);
                const isCustomSpec = !isStandardSpec && !spec.label;

                return (
                  <div key={spec.key || index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-foreground min-w-[200px]">
                        {spec.label || "커스텀 스펙"}
                        {spec.description && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({spec.description})
                          </span>
                        )}
                      </label>
                      {isCustomSpec && (
                        <Input
                          value={spec.label}
                          onChange={(e) => {
                            const updated = [...specifications];
                            updated[index] = { ...updated[index], label: e.target.value };
                            setSpecifications(updated);
                          }}
                          placeholder="스펙명 입력"
                          className="flex-1"
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-8 flex gap-2">
                        <Input
                          value={spec.value}
                          onChange={(e) => handleSpecificationChange(index, e.target.value)}
                          placeholder="값 입력"
                          className="flex-1"
                          type="text"
                        />
                        <span className="flex items-center px-3 text-sm text-muted-foreground min-w-[80px]">
                          {spec.unit}
                        </span>
                      </div>
                      {isCustomSpec && (
                        <Input
                          value={spec.unit}
                          onChange={(e) => {
                            const updated = [...specifications];
                            updated[index] = { ...updated[index], unit: e.target.value };
                            setSpecifications(updated);
                          }}
                          placeholder="단위"
                          className="col-span-3"
                        />
                      )}
                      {isCustomSpec && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveSpecification(index)}
                          className="col-span-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomSpecification}
              className="w-full"
            >
              <Plus className="h-4 w-4" />
              커스텀 스펙 추가
            </Button>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancelClick}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEditMode ? "수정 중..." : "등록 중...") : (isEditMode ? "제품 수정" : "제품 등록")}
          </Button>
        </div>
      </form>

      {/* 수정 확인 모달 */}
      <AlertDialog open={showUpdateConfirm} onOpenChange={setShowUpdateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정보를 수정하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              입력하신 내용으로 제품 정보를 수정합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              const input = validateAndGetInput();
              if (input) submitData(input);
            }}>
              수정
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 수정 취소 확인 모달 */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>수정을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              지금까지 수정한 정보는 저장되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>수정 계속</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                router.back();
              }
            }}>
              수정 취소
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
