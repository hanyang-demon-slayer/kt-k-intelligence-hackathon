import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateCompany } from '../hooks/useApi';

interface CompanyRegistrationProps {
  onComplete?: () => void;
}

interface CompanyFormData {
  name: string;
}

const CompanyRegistration: React.FC<CompanyRegistrationProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: ''
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const createCompanyMutation = useCreateCompany();

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCompanyMutation.mutateAsync({ name: formData.name });
      
      toast.success('기업 등록이 완료되었습니다!');
      setIsCompleted(true);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('기업 등록 실패:', error);
      toast.error('기업 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">등록 완료!</h2>
              <p className="text-gray-600 mb-6">
                {formData.name} 기업 등록이 성공적으로 완료되었습니다.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                대시보드로 이동
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">기업 등록</h1>
          <p className="text-gray-600">채용 시스템을 사용하기 위해 기업 정보를 등록해주세요.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center">
                <Building2 className="w-5 h-5" />
                기업 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg font-medium">회사명 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="회사명을 입력하세요"
                  required
                  className="text-lg py-3"
                />
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p>회사명만 입력하면 채용 시스템을 사용할 수 있습니다.</p>
                <p>추가 정보는 나중에 채용공고에서 설정할 수 있습니다.</p>
              </div>
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              disabled={createCompanyMutation.isPending || !formData.name}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-lg"
            >
              {createCompanyMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  등록 중...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  기업 등록하기
                </>
              )}
            </Button>
          </div>
        </form>

        {/* 안내 메시지 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">등록 안내</h3>
              <p className="text-sm text-blue-700">
                회사명만 입력하면 채용공고 작성을 시작할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
