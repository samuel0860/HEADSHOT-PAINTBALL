import { useState, useMemo } from 'react';
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { usePagination } from '../../hooks/usePagination';
import { TableSkeleton } from './Skeleton';

export function Table({
  columns,
  data,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado.',
  pageSize = 10,
  rowKey = 'id',
}) {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), 'pt-BR', { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortField, sortDir]);

  const { paginatedItems, currentPage, totalPages, nextPage, prevPage, goToPage, hasNext, hasPrev, startIndex, endIndex, totalItems } = usePagination(sortedData, pageSize);

  if (loading) return <TableSkeleton rows={5} />;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider bg-[#111111] whitespace-nowrap
                    ${col.sortable ? 'cursor-pointer hover:text-white select-none' : ''}
                  `}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  style={col.width ? { width: col.width } : {}}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="flex flex-col ml-1">
                        <FiChevronUp size={10} className={sortField === col.key && sortDir === 'asc' ? 'text-[#e85c0d]' : 'text-[#3a3a3a]'} />
                        <FiChevronDown size={10} className={sortField === col.key && sortDir === 'desc' ? 'text-[#e85c0d]' : 'text-[#3a3a3a]'} style={{marginTop: '-2px'}} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#64748b]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedItems.map((row) => (
                <tr key={row[rowKey]} className="border-b border-[#1e1e1e] table-row-hover transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-[#f1f5f9] whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > pageSize && (
        <div className="flex items-center justify-between mt-4 text-sm text-[#94a3b8]">
          <span>
            Mostrando {startIndex}–{endIndex} de {totalItems} registros
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={!hasPrev}
              className="p-1.5 rounded-lg border border-[#2a2a2a] hover:border-[#e85c0d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - currentPage) <= 2)
              .map(p => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors
                    ${p === currentPage
                      ? 'bg-[#e85c0d] text-white'
                      : 'border border-[#2a2a2a] hover:border-[#e85c0d] text-[#94a3b8]'
                    }
                  `}
                >
                  {p}
                </button>
              ))
            }
            <button
              onClick={nextPage}
              disabled={!hasNext}
              className="p-1.5 rounded-lg border border-[#2a2a2a] hover:border-[#e85c0d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
