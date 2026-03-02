import {
  Eye,
  Edit3,
  Copy,
  Check,
  FileCode,
  FileDown,
  Loader2,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface PortfolioPreviewProps {
  isMobile: boolean
  generatedHTML: string
  viewMode: 'preview' | 'edit'
  setViewMode: (v: 'preview' | 'edit') => void
  editableHTML: string
  setEditableHTML: (v: string) => void
  handleCopyToClipboard: () => void
  handleDownloadHTML: () => void
  handleDownloadPDF: () => void
  isDownloadingPdf: boolean
  copied: boolean
  previewRef: React.RefObject<HTMLDivElement>
}

export function PortfolioPreview({
  isMobile,
  generatedHTML,
  viewMode,
  setViewMode,
  editableHTML,
  setEditableHTML,
  handleCopyToClipboard,
  handleDownloadHTML,
  handleDownloadPDF,
  isDownloadingPdf,
  copied,
  previewRef
}: PortfolioPreviewProps) {
  return (
    <div className="h-full flex flex-col bg-[#F5F4F0] overflow-hidden">
      {/* Header preview */}
      <div className={`flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-4 py-2'} bg-white border-b border-[#E8E6E0] flex-shrink-0`}>
        <span className={`${isMobile ? 'text-base' : 'text-sm'} font-medium text-[#1F2D26]`}>Vista Previa</span>
        {generatedHTML && (
          <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1'}`}>
            {/* View mode toggle */}
            <div className={`flex bg-[#F5F4F0] rounded-xl ${isMobile ? 'p-1 mr-2' : 'p-0.5 mr-2'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('preview')}
                className={`${isMobile ? 'h-10 text-sm px-3' : 'h-7 text-xs'} rounded-lg ${viewMode === 'preview' ? 'bg-white shadow-sm' : ''}`}
              >
                <Eye className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Vista
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('edit')}
                className={`${isMobile ? 'h-10 text-sm px-3' : 'h-7 text-xs'} rounded-lg ${viewMode === 'edit' ? 'bg-white shadow-sm' : ''}`}
              >
                <Edit3 className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Editar
              </Button>
            </div>

            {/* Action buttons */}
            <div className={`flex ${isMobile ? 'overflow-x-auto scrollbar-hide gap-2 max-w-[180px]' : 'gap-1'}`}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className={`${isMobile ? 'h-10 text-sm px-3 flex-shrink-0' : 'h-7 text-xs'} border-[#5A9E7F] text-[#5A9E7F] rounded-xl`}
              >
                {copied ? <><Check className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Listo</> : <><Copy className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />Copiar</>}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadHTML}
                className={`${isMobile ? 'h-10 text-sm px-3 flex-shrink-0' : 'h-7 text-xs'} border-[#C4846C] text-[#C4846C] rounded-xl`}
              >
                <FileCode className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />HTML
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isDownloadingPdf}
                className={`${isMobile ? 'h-10 text-sm px-3 flex-shrink-0' : 'h-7 text-xs'} border-[#2D5A4A] text-[#2D5A4A] rounded-xl`}
              >
                {isDownloadingPdf ? <><Loader2 className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} animate-spin mr-1`} />...</> : <><FileDown className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} mr-1`} />PDF</>}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Contenido preview */}
      <div className="flex-1 overflow-auto p-4" ref={previewRef}>
        {generatedHTML ? (
          viewMode === 'preview' ? (
            <div className="bg-white rounded-xl shadow-sm border border-[#E8E6E0] overflow-hidden h-full">
              <iframe
                srcDoc={editableHTML}
                title="Preview"
                className={`w-full h-full ${isMobile ? 'min-h-[500px]' : ''} bg-[#FAFAF8]`}
              />
            </div>
          ) : (
            <Textarea
              value={editableHTML}
              onChange={(e) => setEditableHTML(e.target.value)}
              className={`font-mono ${isMobile ? 'text-xs min-h-[500px]' : 'text-[10px] min-h-full'} bg-white rounded-xl`}
              placeholder="HTML..."
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#7A8B80]">
            <FileText className={`${isMobile ? 'w-20 h-20' : 'w-16 h-16'} mb-4 opacity-30`} />
            <p className={isMobile ? 'text-lg' : 'font-medium'}>Sin plan generado</p>
            <p className={isMobile ? 'text-base mt-2' : 'text-sm mt-1'}>Completa el formulario y genera el plan</p>
          </div>
        )}
      </div>
    </div>
  )
}
