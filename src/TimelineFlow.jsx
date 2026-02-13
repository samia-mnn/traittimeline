import React, {useCallback, useMemo, useEffect, useState} from 'react'
import ReactFlow, { Background, Controls, applyNodeChanges } from 'reactflow'
import 'reactflow/dist/style.css'
import { Handle, Position, MarkerType } from 'reactflow'



function ImageNode({data}){
  const imgStyle = {
    width: 160,
    height: 200,
    objectFit: 'cover',
    borderRadius: 4,
    border: '1px solid #ddd'
  }
  return (
    <>
          <Handle id={'in'} type="target" position={Position.Left} />
    <div style={{padding:8, width:180, textAlign:'center', background: 'white', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
      <div style={{fontSize:12, marginBottom:6, fontWeight: 500}}>{data.title || ''}</div>
      {data.image_url ? <img src={data.image_url} alt={data.title} style={imgStyle} /> : <div style={{...imgStyle, display:'flex', alignItems:'center', justifyContent:'center', color:'#666'}}>No image</div>}
      <div style={{fontSize:11, marginTop:6, color: '#666'}}>{data.date || ''}</div>
    </div>
          <Handle id={'out'} type="source" position={Position.Right} />
    </>

  )
}

export default function TimelineFlow({items}){
  const nodeWidth = 200
  const nodeHeight = 160
  const yPos = 60

  const initialNodes = useMemo(()=>items.map((it, i) => ({
    id: String(i),
    type: 'imageNode',
    data: { ...it },
    position: { x: i * (nodeWidth + 40), y: yPos },
    style: { width: nodeWidth, height: nodeHeight },
    draggable: true
  })), [items])

  const edges = useMemo(()=>items.slice(1).map((_,i) => ({
    id: `e${i}-${i+1}`,
    source: String(i),
    target: String(i+1),
    animated: true,
    type: 'smoothstep',
    sourceHandle: 'out',
    targetHandle: 'in',
    style: { stroke: '#888', strokeWidth: 2 },
    markerEnd: { 
      type: MarkerType.ArrowClosed,
      color: '#888',
      width: 20,
      height: 20
    }
  })), [items])

  const [nodes, setNodes] = useState(initialNodes)

  useEffect(()=>{
    setNodes(initialNodes)
  }, [initialNodes])

  const onNodesChange = useCallback((changes) => {
    setNodes(ns => applyNodeChanges(changes, ns))
  }, [])

  const nodeTypes = useMemo(()=>({ imageNode: ImageNode }), [])

  return (
    <div style={{height: '100%', width: '100%', border: '1px solid #eee', borderRadius:6, overflow: 'hidden'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodesDraggable={true}
        nodesConnectable={false}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={2}
      >
        <Background gap={16} color="#ddd" />
        <Controls />
      </ReactFlow>
    </div>
  )
}