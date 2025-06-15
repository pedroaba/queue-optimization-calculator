import { pyodideAtom } from '@renderer/atoms/pyodide'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export function usePyodide() {
  const [pyodide, setPyodide] = useAtom<any>(pyodideAtom)

  useEffect(() => {
    async function loadPyodide() {
      if (pyodide) {
        return
      }

      const base = window.PYODIDE_BASE_URL ?? './pyodide/'

      // @ts-ignore
      const pyodideInstance = await window.loadPyodide({
        indexURL: base,
      })

      setPyodide(pyodideInstance)
    }

    loadPyodide()
  }, [pyodide])

  return pyodide
}
