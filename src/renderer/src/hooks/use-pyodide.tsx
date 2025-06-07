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

      // @ts-ignore
      const pyodideInstance = await window.loadPyodide({
        indexURL: '/pyodide/',
      })

      setPyodide(pyodideInstance)
    }

    loadPyodide()
  }, [pyodide])

  return pyodide
}
